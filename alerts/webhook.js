/**
 * Webhook 警报处理器 - 博客系统监控警报
 * 适用于 Next.js 15.3.5+ & React 19.1.0+ 应用程序
 * 支持多种通知渠道：Slack, Discord, 邮件, 短信等
 */

const express = require('express')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const { performance } = require('perf_hooks')
const fs = require('fs').promises
const path = require('path')

// 配置
const CONFIG = {
  port: process.env.WEBHOOK_PORT || 9999,
  secret: process.env.WEBHOOK_SECRET || 'your-webhook-secret',
  logFile: '/var/log/blog/alerts.log',
  
  // 邮件配置
  email: {
    enabled: process.env.EMAIL_ALERTS_ENABLED === 'true',
    smtp: {
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
    from: process.env.ALERT_FROM_EMAIL || 'alerts@yourdomain.com',
    to: process.env.ALERT_TO_EMAIL || 'admin@yourdomain.com',
  },
  
  // Slack 配置
  slack: {
    enabled: process.env.SLACK_ALERTS_ENABLED === 'true',
    webhookUrl: process.env.SLACK_WEBHOOK_URL,
    channel: process.env.SLACK_CHANNEL || '#alerts',
    username: process.env.SLACK_USERNAME || 'Blog Monitor',
  },
  
  // Discord 配置
  discord: {
    enabled: process.env.DISCORD_ALERTS_ENABLED === 'true',
    webhookUrl: process.env.DISCORD_WEBHOOK_URL,
  },
  
  // 短信配置 (Twilio)
  sms: {
    enabled: process.env.SMS_ALERTS_ENABLED === 'true',
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    from: process.env.TWILIO_FROM,
    to: process.env.TWILIO_TO,
  },
  
  // 警报级别配置
  alertLevels: {
    critical: {
      methods: ['email', 'slack', 'discord', 'sms'],
      cooldown: 5 * 60 * 1000, // 5 分钟冷却
    },
    warning: {
      methods: ['email', 'slack'],
      cooldown: 15 * 60 * 1000, // 15 分钟冷却
    },
    info: {
      methods: ['slack'],
      cooldown: 30 * 60 * 1000, // 30 分钟冷却
    },
  },
}

// 应用程序实例
const app = express()
app.use(express.json())

// 警报历史记录 (内存中，生产环境建议使用 Redis)
const alertHistory = new Map()
const cooldownTracker = new Map()

// 邮件传输器
let emailTransporter = null
if (CONFIG.email.enabled) {
  emailTransporter = nodemailer.createTransporter(CONFIG.email.smtp)
}

// 日志记录函数
async function logAlert(message, level = 'info') {
  const timestamp = new Date().toISOString()
  const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`
  
  try {
    await fs.appendFile(CONFIG.logFile, logEntry)
  } catch (error) {
    console.error('无法写入日志文件:', error)
  }
  
  console.log(logEntry.trim())
}

// 验证 Webhook 签名
function verifySignature(payload, signature) {
  if (!CONFIG.secret) return true // 如果没有设置密钥，跳过验证
  
  const expectedSignature = crypto
    .createHmac('sha256', CONFIG.secret)
    .update(payload)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(`sha256=${expectedSignature}`),
    Buffer.from(signature)
  )
}

// 检查冷却期
function checkCooldown(alertKey, level) {
  const cooldownKey = `${alertKey}_${level}`
  const lastSent = cooldownTracker.get(cooldownKey)
  const cooldownPeriod = CONFIG.alertLevels[level]?.cooldown || 0
  
  if (lastSent && Date.now() - lastSent < cooldownPeriod) {
    return false // 仍在冷却期
  }
  
  cooldownTracker.set(cooldownKey, Date.now())
  return true
}

// 格式化警报消息
function formatAlertMessage(alert, format = 'text') {
  const { alertname, severity, status, summary, description, instance, job } = alert
  const timestamp = new Date().toISOString()
  
  const baseInfo = {
    alertname,
    severity,
    status,
    summary,
    description,
    instance,
    job,
    timestamp,
  }
  
  switch (format) {
    case 'slack':
      return {
        channel: CONFIG.slack.channel,
        username: CONFIG.slack.username,
        icon_emoji: severity === 'critical' ? ':rotating_light:' : ':warning:',
        attachments: [
          {
            color: severity === 'critical' ? 'danger' : severity === 'warning' ? 'warning' : 'good',
            title: `${alertname} - ${status}`,
            text: summary,
            fields: [
              { title: '严重级别', value: severity, short: true },
              { title: '实例', value: instance, short: true },
              { title: '任务', value: job, short: true },
              { title: '时间', value: timestamp, short: true },
            ],
            footer: '博客监控系统',
            ts: Math.floor(Date.now() / 1000),
          },
        ],
      }
    
    case 'discord':
      return {
        embeds: [
          {
            title: `${alertname} - ${status}`,
            description: summary,
            color: severity === 'critical' ? 0xff0000 : severity === 'warning' ? 0xffa500 : 0x00ff00,
            fields: [
              { name: '严重级别', value: severity, inline: true },
              { name: '实例', value: instance, inline: true },
              { name: '任务', value: job, inline: true },
              { name: '详细信息', value: description || '无', inline: false },
            ],
            timestamp: new Date().toISOString(),
            footer: { text: '博客监控系统' },
          },
        ],
      }
    
    case 'email':
      return {
        subject: `[博客警报] ${alertname} - ${severity}`,
        html: `
          <h2>博客系统警报</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="border: 1px solid #ddd; padding: 8px;"><strong>警报名称:</strong></td><td style="border: 1px solid #ddd; padding: 8px;">${alertname}</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 8px;"><strong>状态:</strong></td><td style="border: 1px solid #ddd; padding: 8px;">${status}</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 8px;"><strong>严重级别:</strong></td><td style="border: 1px solid #ddd; padding: 8px;">${severity}</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 8px;"><strong>摘要:</strong></td><td style="border: 1px solid #ddd; padding: 8px;">${summary}</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 8px;"><strong>实例:</strong></td><td style="border: 1px solid #ddd; padding: 8px;">${instance}</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 8px;"><strong>任务:</strong></td><td style="border: 1px solid #ddd; padding: 8px;">${job}</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 8px;"><strong>时间:</strong></td><td style="border: 1px solid #ddd; padding: 8px;">${timestamp}</td></tr>
          </table>
          ${description ? `<p><strong>详细信息:</strong><br>${description}</p>` : ''}
          <p><em>此警报由博客监控系统自动生成</em></p>
        `,
        text: `
          博客系统警报
          
          警报名称: ${alertname}
          状态: ${status}
          严重级别: ${severity}
          摘要: ${summary}
          实例: ${instance}
          任务: ${job}
          时间: ${timestamp}
          ${description ? `\n详细信息: ${description}` : ''}
          
          此警报由博客监控系统自动生成
        `,
      }
    
    case 'sms':
      return `博客警报: ${alertname} - ${severity}. ${summary}. 时间: ${timestamp}`
    
    default:
      return baseInfo
  }
}

// 发送 Slack 通知
async function sendSlackAlert(message) {
  if (!CONFIG.slack.enabled || !CONFIG.slack.webhookUrl) return false
  
  try {
    const response = await fetch(CONFIG.slack.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    })
    
    if (response.ok) {
      await logAlert('Slack 通知发送成功')
      return true
    } else {
      throw new Error(`Slack API 错误: ${response.statusText}`)
    }
  } catch (error) {
    await logAlert(`Slack 通知发送失败: ${error.message}`, 'error')
    return false
  }
}

// 发送 Discord 通知
async function sendDiscordAlert(message) {
  if (!CONFIG.discord.enabled || !CONFIG.discord.webhookUrl) return false
  
  try {
    const response = await fetch(CONFIG.discord.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    })
    
    if (response.ok) {
      await logAlert('Discord 通知发送成功')
      return true
    } else {
      throw new Error(`Discord API 错误: ${response.statusText}`)
    }
  } catch (error) {
    await logAlert(`Discord 通知发送失败: ${error.message}`, 'error')
    return false
  }
}

// 发送邮件通知
async function sendEmailAlert(message) {
  if (!CONFIG.email.enabled || !emailTransporter) return false
  
  try {
    const mailOptions = {
      from: CONFIG.email.from,
      to: CONFIG.email.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    }
    
    await emailTransporter.sendMail(mailOptions)
    await logAlert('邮件通知发送成功')
    return true
  } catch (error) {
    await logAlert(`邮件通知发送失败: ${error.message}`, 'error')
    return false
  }
}

// 发送短信通知
async function sendSMSAlert(message) {
  if (!CONFIG.sms.enabled) return false
  
  try {
    // 这里需要实际的 Twilio 客户端
    // const twilio = require('twilio')(CONFIG.sms.accountSid, CONFIG.sms.authToken)
    // await twilio.messages.create({
    //   body: message,
    //   from: CONFIG.sms.from,
    //   to: CONFIG.sms.to,
    // })
    
    await logAlert('短信通知发送成功 (模拟)')
    return true
  } catch (error) {
    await logAlert(`短信通知发送失败: ${error.message}`, 'error')
    return false
  }
}

// 处理单个警报
async function processAlert(alert) {
  const { alertname, severity, status } = alert
  const alertKey = `${alertname}_${alert.instance}`
  
  await logAlert(`处理警报: ${alertname} (${severity}) - ${status}`)
  
  // 检查冷却期
  if (!checkCooldown(alertKey, severity)) {
    await logAlert(`警报 ${alertKey} 仍在冷却期内，跳过发送`)
    return
  }
  
  // 获取警报级别配置
  const levelConfig = CONFIG.alertLevels[severity] || CONFIG.alertLevels.info
  const methods = levelConfig.methods || ['email']
  
  // 记录警报历史
  alertHistory.set(alertKey, {
    ...alert,
    processedAt: Date.now(),
  })
  
  // 发送通知
  const results = []
  
  for (const method of methods) {
    switch (method) {
      case 'slack':
        if (CONFIG.slack.enabled) {
          const slackMessage = formatAlertMessage(alert, 'slack')
          results.push(await sendSlackAlert(slackMessage))
        }
        break
      
      case 'discord':
        if (CONFIG.discord.enabled) {
          const discordMessage = formatAlertMessage(alert, 'discord')
          results.push(await sendDiscordAlert(discordMessage))
        }
        break
      
      case 'email':
        if (CONFIG.email.enabled) {
          const emailMessage = formatAlertMessage(alert, 'email')
          results.push(await sendEmailAlert(emailMessage))
        }
        break
      
      case 'sms':
        if (CONFIG.sms.enabled) {
          const smsMessage = formatAlertMessage(alert, 'sms')
          results.push(await sendSMSAlert(smsMessage))
        }
        break
    }
  }
  
  const successCount = results.filter(Boolean).length
  await logAlert(`警报 ${alertKey} 通知发送完成: ${successCount}/${results.length} 成功`)
}

// Webhook 端点
app.post('/webhook', async (req, res) => {
  const startTime = performance.now()
  
  try {
    // 验证签名
    const signature = req.headers['x-hub-signature-256'] || req.headers['x-signature']
    const payload = JSON.stringify(req.body)
    
    if (signature && !verifySignature(payload, signature)) {
      await logAlert('Webhook 签名验证失败', 'warning')
      return res.status(401).json({ error: 'Invalid signature' })
    }
    
    const { alerts } = req.body
    
    if (!alerts || !Array.isArray(alerts)) {
      await logAlert('无效的 webhook 数据格式', 'warning')
      return res.status(400).json({ error: 'Invalid webhook data' })
    }
    
    await logAlert(`收到 ${alerts.length} 个警报`)
    
    // 处理所有警报
    const promises = alerts.map(alert => processAlert(alert))
    await Promise.allSettled(promises)
    
    const processingTime = performance.now() - startTime
    await logAlert(`警报处理完成，耗时: ${processingTime.toFixed(2)}ms`)
    
    res.json({
      status: 'success',
      processed: alerts.length,
      processingTime: `${processingTime.toFixed(2)}ms`,
    })
    
  } catch (error) {
    await logAlert(`Webhook 处理错误: ${error.message}`, 'error')
    res.status(500).json({ error: 'Internal server error' })
  }
})

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    alertHistory: alertHistory.size,
    cooldownTracker: cooldownTracker.size,
    config: {
      email: CONFIG.email.enabled,
      slack: CONFIG.slack.enabled,
      discord: CONFIG.discord.enabled,
      sms: CONFIG.sms.enabled,
    },
  })
})

// 警报历史端点
app.get('/alerts/history', (req, res) => {
  const limit = parseInt(req.query.limit) || 100
  const history = Array.from(alertHistory.values())
    .sort((a, b) => b.processedAt - a.processedAt)
    .slice(0, limit)
  
  res.json({
    alerts: history,
    total: alertHistory.size,
  })
})

// 清理历史记录 (定期执行)
function cleanupHistory() {
  const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 天
  const cutoff = Date.now() - maxAge
  
  let cleaned = 0
  for (const [key, alert] of alertHistory.entries()) {
    if (alert.processedAt < cutoff) {
      alertHistory.delete(key)
      cleaned++
    }
  }
  
  // 清理冷却追踪
  for (const [key, timestamp] of cooldownTracker.entries()) {
    if (timestamp < cutoff) {
      cooldownTracker.delete(key)
    }
  }
  
  if (cleaned > 0) {
    logAlert(`清理了 ${cleaned} 个历史警报记录`)
  }
}

// 每小时清理一次历史记录
setInterval(cleanupHistory, 60 * 60 * 1000)

// 优雅关闭
process.on('SIGTERM', async () => {
  await logAlert('收到 SIGTERM 信号，正在关闭 webhook 服务器')
  process.exit(0)
})

process.on('SIGINT', async () => {
  await logAlert('收到 SIGINT 信号，正在关闭 webhook 服务器')
  process.exit(0)
})

// 启动服务器
app.listen(CONFIG.port, () => {
  logAlert(`Webhook 服务器启动，监听端口 ${CONFIG.port}`)
  logAlert(`配置: 邮件=${CONFIG.email.enabled}, Slack=${CONFIG.slack.enabled}, Discord=${CONFIG.discord.enabled}, SMS=${CONFIG.sms.enabled}`)
})

module.exports = app