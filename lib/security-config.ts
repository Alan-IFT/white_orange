/**
 * 安全配置策略
 * 提供 CSP、CORS、输入验证、环境变量验证等安全功能
 */

import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'

// CSP (Content Security Policy) 配置
export const CSP_DIRECTIVES = {
  // 默认源策略
  'default-src': ["'self'"],
  
  // 脚本源策略
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Next.js 需要
    "'unsafe-eval'",   // 开发环境需要
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://cdn.vercel-analytics.com'
  ],
  
  // 样式源策略
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Tailwind CSS 需要
    'https://fonts.googleapis.com'
  ],
  
  // 图片源策略
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https:',
    'https://images.unsplash.com',
    'https://cdn.example.com', // 你的 CDN 域名
    'https://r2.cloudflarestorage.com' // Cloudflare R2
  ],
  
  // 字体源策略
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com'
  ],
  
  // 连接源策略
  'connect-src': [
    "'self'",
    'https://www.google-analytics.com',
    'https://vitals.vercel-analytics.com',
    'https://api.github.com' // 如果需要 GitHub API
  ],
  
  // 媒体源策略
  'media-src': [
    "'self'",
    'https:'
  ],
  
  // 对象源策略
  'object-src': ["'none'"],
  
  // 基础 URI 策略
  'base-uri': ["'self'"],
  
  // 表单提交策略
  'form-action': ["'self'"],
  
  // 框架祖先策略
  'frame-ancestors': ["'none'"],
  
  // 升级不安全请求
  'upgrade-insecure-requests': []
} as const

// 生成 CSP 字符串
export function generateCSPString(isDevelopment = false): string {
  const directives = { ...CSP_DIRECTIVES }
  
  if (isDevelopment) {
    // 开发环境允许更宽松的策略
    directives['script-src'].push("'unsafe-eval'")
    directives['connect-src'].push('ws:', 'wss:') // WebSocket for HMR
  }
  
  return Object.entries(directives)
    .map(([directive, sources]) => {
      if (sources.length === 0) return directive
      return `${directive} ${sources.join(' ')}`
    })
    .join('; ')
}

// CORS 配置
export const CORS_CONFIG = {
  // 允许的源
  allowedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'https://yourdomain.com',
    'https://www.yourdomain.com'
  ],
  
  // 允许的方法
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  
  // 允许的头部
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  
  // 暴露的头部
  exposedHeaders: ['X-Total-Count'],
  
  // 是否允许凭据
  credentials: true,
  
  // 预检请求缓存时间 (秒)
  maxAge: 86400
} as const

// 验证 CORS 源
export function isValidOrigin(origin: string): boolean {
  if (!origin) return false
  
  // 在生产环境中严格验证
  if (process.env.NODE_ENV === 'production') {
    return CORS_CONFIG.allowedOrigins.includes(origin)
  }
  
  // 开发环境允许 localhost
  return origin.startsWith('http://localhost:') || 
         CORS_CONFIG.allowedOrigins.includes(origin)
}

// 环境变量验证 Schema
export const EnvSchema = z.object({
  // 基础配置
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_OUTPUT_MODE: z.enum(['export', 'standalone']).optional(),
  
  // 站点信息
  NEXT_PUBLIC_SITE_NAME: z.string().min(1, '站点名称不能为空'),
  NEXT_PUBLIC_SITE_DESCRIPTION: z.string().min(1, '站点描述不能为空'),
  NEXT_PUBLIC_SITE_URL: z.string().url('站点 URL 格式不正确'),
  NEXT_PUBLIC_AUTHOR_NAME: z.string().min(1, '作者名称不能为空'),
  NEXT_PUBLIC_AUTHOR_EMAIL: z.string().email('作者邮箱格式不正确'),
  
  // 可选配置
  NEXT_PUBLIC_AUTHOR_AVATAR: z.string().url().optional(),
  NEXT_PUBLIC_SOCIAL_GITHUB: z.string().url().optional(),
  NEXT_PUBLIC_SOCIAL_TWITTER: z.string().optional(),
  NEXT_PUBLIC_SOCIAL_LINKEDIN: z.string().url().optional(),
  
  // 图片配置
  NEXT_PUBLIC_IMAGE_HOST: z.string().url().optional(),
  CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().optional(),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().optional(),
  CLOUDFLARE_R2_BUCKET_NAME: z.string().optional(),
  CLOUDFLARE_R2_ENDPOINT: z.string().url().optional(),
  
  // 分析配置
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_VERCEL_ANALYTICS: z.string().optional(),
  
  // API 密钥
  GITHUB_TOKEN: z.string().optional(),
  OPENAI_API_KEY: z.string().optional()
})

// 验证环境变量
export function validateEnv() {
  try {
    const env = EnvSchema.parse(process.env)
    console.log('✅ 环境变量验证通过')
    return env
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join('\n')
      
      console.error('❌ 环境变量验证失败:')
      console.error(errorMessages)
      
      if (process.env.NODE_ENV === 'production') {
        throw new Error('生产环境环境变量验证失败')
      }
    }
    
    return null
  }
}

// 输入验证和清理函数
export class InputValidator {
  // 验证和清理 HTML 内容
  static sanitizeHTML(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 'b', 'i',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote',
        'code', 'pre', 'a', 'img'
      ],
      ALLOWED_ATTR: [
        'href', 'src', 'alt', 'title', 'class', 'id'
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i
    })
  }
  
  // 验证和清理 Markdown 内容
  static sanitizeMarkdown(input: string): string {
    // 移除潜在的危险内容
    return input
      .replace(/<script[\s\S]*?<\/script>/gi, '') // 移除 script 标签
      .replace(/javascript:/gi, '') // 移除 javascript: 协议
      .replace(/on\w+\s*=/gi, '') // 移除事件处理器
      .trim()
  }
  
  // 验证文件名
  static validateFileName(fileName: string): boolean {
    const dangerousPatterns = [
      /\.\./,           // 路径遍历
      /[<>:"|?*]/,      // Windows 非法字符
      /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Windows 保留名称
      /^\./,            // 隐藏文件
      /\s+$/            // 末尾空格
    ]
    
    return !dangerousPatterns.some(pattern => pattern.test(fileName))
  }
  
  // 验证 URL
  static validateURL(url: string): boolean {
    try {
      const parsedURL = new URL(url)
      
      // 只允许 http 和 https 协议
      if (!['http:', 'https:'].includes(parsedURL.protocol)) {
        return false
      }
      
      // 防止内网地址访问
      const hostname = parsedURL.hostname
      const privateIPPatterns = [
        /^127\./,           // 127.x.x.x
        /^192\.168\./,      // 192.168.x.x
        /^10\./,            // 10.x.x.x
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // 172.16.x.x - 172.31.x.x
        /^localhost$/i,     // localhost
        /^0\.0\.0\.0$/      // 0.0.0.0
      ]
      
      if (privateIPPatterns.some(pattern => pattern.test(hostname))) {
        return false
      }
      
      return true
    } catch {
      return false
    }
  }
  
  // 验证邮箱地址
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 254
  }
  
  // 验证用户输入长度
  static validateLength(input: string, min: number, max: number): boolean {
    return input.length >= min && input.length <= max
  }
  
  // SQL 注入检测 (基础版本)
  static detectSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(--|\/\*|\*\/|;|'|")/,
      /(\bOR\b|\bAND\b).*?[=<>]/i
    ]
    
    return sqlPatterns.some(pattern => pattern.test(input))
  }
  
  // XSS 检测
  static detectXSS(input: string): boolean {
    const xssPatterns = [
      /<script[\s\S]*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[\s\S]*?<\/iframe>/gi,
      /<object[\s\S]*?<\/object>/gi,
      /<embed[\s\S]*?>/gi
    ]
    
    return xssPatterns.some(pattern => pattern.test(input))
  }
}

// 安全头部配置
export const SECURITY_HEADERS = {
  // 强制 HTTPS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // 防止 MIME 类型嗅探
  'X-Content-Type-Options': 'nosniff',
  
  // XSS 保护
  'X-XSS-Protection': '1; mode=block',
  
  // 防止页面被嵌入框架
  'X-Frame-Options': 'DENY',
  
  // 推荐策略
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // 权限策略
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  
  // DNS 预取控制
  'X-DNS-Prefetch-Control': 'off'
} as const

// 生成安全中间件
export function createSecurityMiddleware() {
  return {
    // 设置安全头部
    setSecurityHeaders: (headers: Headers) => {
      Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        headers.set(key, value)
      })
      
      // 设置 CSP
      headers.set(
        'Content-Security-Policy',
        generateCSPString(process.env.NODE_ENV === 'development')
      )
    },
    
    // 验证请求
    validateRequest: (request: Request) => {
      const origin = request.headers.get('origin')
      
      if (origin && !isValidOrigin(origin)) {
        throw new Error('Invalid origin')
      }
      
      return true
    },
    
    // 限流配置 (基础版本)
    rateLimiting: {
      windowMs: 15 * 60 * 1000, // 15 分钟
      max: 100, // 限制每个 IP 100 个请求
      message: '请求过于频繁，请稍后再试'
    }
  }
}

// API 路由安全装饰器
export function withSecurity(handler: Function) {
  return async (req: any, res: any) => {
    try {
      // 验证请求
      const security = createSecurityMiddleware()
      security.validateRequest(req)
      
      // 设置安全头部
      const headers = new Headers()
      security.setSecurityHeaders(headers)
      
      headers.forEach((value, key) => {
        res.setHeader(key, value)
      })
      
      return await handler(req, res)
    } catch (error) {
      console.error('安全验证失败:', error)
      return res.status(403).json({ error: 'Forbidden' })
    }
  }
}

// 密钥管理工具
export class SecretManager {
  // 验证 API 密钥格式
  static validateAPIKey(key: string): boolean {
    // API 密钥应该至少 32 个字符
    return key.length >= 32 && /^[a-zA-Z0-9_-]+$/.test(key)
  }
  
  // 掩码敏感信息
  static maskSensitiveData(data: string): string {
    if (data.length <= 8) return '***'
    
    const start = data.slice(0, 4)
    const end = data.slice(-4)
    const middle = '*'.repeat(data.length - 8)
    
    return `${start}${middle}${end}`
  }
  
  // 检查密钥是否泄露
  static checkForExposedSecrets(content: string): string[] {
    const secretPatterns = [
      { name: 'API Key', pattern: /api[_-]?key[\s]*[:=][\s]*['"]*([a-zA-Z0-9_-]{32,})['"]*\s*/gi },
      { name: 'Secret Key', pattern: /secret[_-]?key[\s]*[:=][\s]*['"]*([a-zA-Z0-9_-]{32,})['"]*\s*/gi },
      { name: 'Access Token', pattern: /access[_-]?token[\s]*[:=][\s]*['"]*([a-zA-Z0-9_-]{32,})['"]*\s*/gi },
      { name: 'Private Key', pattern: /-----BEGIN[A-Z\s]+PRIVATE KEY-----/gi }
    ]
    
    const exposedSecrets: string[] = []
    
    secretPatterns.forEach(({ name, pattern }) => {
      const matches = content.match(pattern)
      if (matches) {
        exposedSecrets.push(`检测到可能的 ${name} 泄露`)
      }
    })
    
    return exposedSecrets
  }
}

// 初始化安全配置
export function initializeSecurity() {
  // 验证环境变量
  validateEnv()
  
  // 检查是否为 HTTPS (生产环境)
  if (process.env.NODE_ENV === 'production' && 
      typeof window !== 'undefined' && 
      window.location.protocol !== 'https:') {
    console.warn('⚠️  生产环境建议使用 HTTPS')
  }
  
  console.log('🔒 安全配置初始化完成')
}