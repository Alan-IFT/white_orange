/**
 * Playwright 全局设置 - E2E 测试环境准备
 * 在所有测试运行前执行的初始化操作
 */

import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🚀 开始 E2E 测试环境设置...')
  
  // 等待服务器启动
  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:3000'
  
  try {
    // 启动浏览器进行健康检查
    const browser = await chromium.launch()
    const page = await browser.newPage()
    
    console.log(`⏳ 等待服务器响应: ${baseURL}`)
    
    // 等待首页加载
    await page.goto(baseURL, { waitUntil: 'networkidle' })
    
    // 验证基本页面元素
    const title = await page.title()
    console.log(`✅ 页面标题: ${title}`)
    
    // 检查关键资源
    const stylesheets = await page.$$eval('link[rel="stylesheet"]', links => 
      links.map(link => link.href)
    )
    console.log(`✅ 样式表加载: ${stylesheets.length} 个`)
    
    // 检查 JavaScript 资源
    const scripts = await page.$$eval('script[src]', scripts => 
      scripts.map(script => script.src)
    )
    console.log(`✅ 脚本加载: ${scripts.length} 个`)
    
    // 性能检查
    const navigationTiming = JSON.parse(
      await page.evaluate(() => JSON.stringify(performance.getEntriesByType('navigation')[0]))
    )
    
    const loadTime = navigationTiming.loadEventEnd - navigationTiming.fetchStart
    console.log(`⚡ 页面加载时间: ${loadTime.toFixed(2)}ms`)
    
    if (loadTime > 5000) {
      console.warn(`⚠️  页面加载时间较长: ${loadTime.toFixed(2)}ms`)
    }
    
    // 检查控制台错误
    const consoleErrors = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })
    
    // 刷新页面以捕获控制台消息
    await page.reload({ waitUntil: 'networkidle' })
    
    if (consoleErrors.length > 0) {
      console.warn('⚠️  发现控制台错误:')
      consoleErrors.forEach(error => console.warn(`   ${error}`))
    } else {
      console.log('✅ 无控制台错误')
    }
    
    // 检查 Core Web Vitals (如果可用)
    try {
      const vitals = await page.evaluate(() => {
        return new Promise((resolve) => {
          const vitals = {}
          
          // LCP - Largest Contentful Paint
          new PerformanceObserver((list) => {
            const entries = list.getEntries()
            if (entries.length > 0) {
              vitals.lcp = entries[entries.length - 1].startTime
            }
          }).observe({ entryTypes: ['largest-contentful-paint'] })
          
          // FID - First Input Delay
          new PerformanceObserver((list) => {
            const entries = list.getEntries()
            if (entries.length > 0) {
              vitals.fid = entries[0].processingStart - entries[0].startTime
            }
          }).observe({ entryTypes: ['first-input'] })
          
          // CLS - Cumulative Layout Shift
          new PerformanceObserver((list) => {
            let clsValue = 0
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value
              }
            }
            vitals.cls = clsValue
          }).observe({ entryTypes: ['layout-shift'] })
          
          setTimeout(() => resolve(vitals), 2000)
        })
      })
      
      console.log('📊 Core Web Vitals:')
      if (vitals.lcp) console.log(`   LCP: ${vitals.lcp.toFixed(2)}ms`)
      if (vitals.fid) console.log(`   FID: ${vitals.fid.toFixed(2)}ms`)
      if (vitals.cls) console.log(`   CLS: ${vitals.cls.toFixed(3)}`)
      
    } catch (error) {
      console.log('ℹ️  无法获取 Core Web Vitals 数据')
    }
    
    await browser.close()
    
    console.log('✅ E2E 测试环境设置完成')
    
  } catch (error) {
    console.error('❌ E2E 测试环境设置失败:', error)
    throw error
  }
}

export default globalSetup