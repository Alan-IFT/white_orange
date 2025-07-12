/**
 * 错误处理和边界情况处理工具
 * 提供统一的错误处理、网络异常处理、图片加载失败处理等功能
 */

import { toast } from '@/components/ui/toast'

// 错误类型定义
export enum ErrorType {
  NETWORK = 'NETWORK',
  PARSE = 'PARSE', 
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT'
}

// 自定义错误类
export class AppError extends Error {
  public readonly type: ErrorType
  public readonly code: string
  public readonly statusCode?: number
  public readonly details?: any

  constructor(
    message: string,
    type: ErrorType,
    code: string,
    statusCode?: number,
    details?: any
  ) {
    super(message)
    this.name = 'AppError'
    this.type = type
    this.code = code
    if (statusCode !== undefined) {
      this.statusCode = statusCode
    }
    this.details = details

    // 维护原型链
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

// 网络请求错误处理
export class NetworkError extends AppError {
  constructor(message: string = '网络连接失败，请检查网络连接', details?: any) {
    super(message, ErrorType.NETWORK, 'NETWORK_ERROR', 0, details)
  }
}

// Markdown 解析错误
export class MarkdownParseError extends AppError {
  constructor(message: string = 'Markdown 文件解析失败', details?: any) {
    super(message, ErrorType.PARSE, 'MARKDOWN_PARSE_ERROR', 400, details)
  }
}

// 网络请求重试配置
interface RetryConfig {
  maxRetries: number
  retryDelay: number
  exponentialBackoff: boolean
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  exponentialBackoff: true
}

// 网络请求失败处理器
export async function withNetworkRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const { maxRetries, retryDelay, exponentialBackoff } = {
    ...DEFAULT_RETRY_CONFIG,
    ...config
  }

  let lastError: Error = new Error('未知网络错误')

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxRetries) {
        break
      }

      // 检查是否应该重试
      if (!shouldRetry(error)) {
        break
      }

      // 计算延迟时间
      const delay = exponentialBackoff 
        ? retryDelay * Math.pow(2, attempt)
        : retryDelay

      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw new NetworkError(
    '网络请求多次重试后仍然失败',
    { originalError: lastError, attempts: maxRetries + 1 }
  )
}

// 判断是否应该重试
function shouldRetry(error: any): boolean {
  // 不重试的情况
  if (error?.response?.status >= 400 && error?.response?.status < 500) {
    return false // 客户端错误不重试
  }
  
  // 网络错误或服务器错误可以重试
  return true
}

// 图片加载失败处理
export function createImageErrorHandler(fallbackSrc?: string) {
  return (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget
    
    if (fallbackSrc && img.src !== fallbackSrc) {
      img.src = fallbackSrc
    } else {
      // 显示默认占位符
      img.style.display = 'none'
      
      // 创建占位符元素
      const placeholder = document.createElement('div')
      placeholder.className = 'bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400'
      placeholder.style.width = img.style.width || '100%'
      placeholder.style.height = img.style.height || '200px'
      placeholder.innerHTML = `
        <div class="text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="mt-2 text-sm">图片加载失败</p>
        </div>
      `
      
      img.parentNode?.insertBefore(placeholder, img.nextSibling)
    }
  }
}

// 离线状态处理
export class OfflineHandler {
  private static instance: OfflineHandler
  private isOnline: boolean = navigator.onLine
  private listeners: ((isOnline: boolean) => void)[] = []

  private constructor() {
    this.setupEventListeners()
  }

  static getInstance(): OfflineHandler {
    if (!OfflineHandler.instance) {
      OfflineHandler.instance = new OfflineHandler()
    }
    return OfflineHandler.instance
  }

  private setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.notifyListeners()
      toast({
        title: '网络已连接',
        description: '网络连接已恢复，您可以继续浏览',
        variant: 'success'
      })
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      this.notifyListeners()
      toast({
        title: '网络连接断开',
        description: '请检查网络连接，部分功能可能无法使用',
        variant: 'warning',
        duration: 0 // 持续显示直到网络恢复
      })
    })
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isOnline))
  }

  public getStatus(): boolean {
    return this.isOnline
  }

  public onStatusChange(listener: (isOnline: boolean) => void) {
    this.listeners.push(listener)
    
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }
}

// 文件上传进度处理
export class UploadProgressHandler {
  private onProgress?: (progress: number) => void
  private onError?: (error: Error) => void
  private onSuccess?: () => void

  constructor(callbacks: {
    onProgress?: (progress: number) => void
    onError?: (error: Error) => void
    onSuccess?: () => void
  }) {
    if (callbacks.onProgress !== undefined) {
      this.onProgress = callbacks.onProgress
    }
    if (callbacks.onError !== undefined) {
      this.onError = callbacks.onError
    }
    if (callbacks.onSuccess !== undefined) {
      this.onSuccess = callbacks.onSuccess
    }
  }

  async uploadFile(file: File, endpoint: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const formData = new FormData()
      formData.append('file', file)

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100
          this.onProgress?.(progress)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          this.onSuccess?.()
          resolve()
        } else {
          const error = new Error(`上传失败: ${xhr.statusText}`)
          this.onError?.(error)
          reject(error)
        }
      })

      xhr.addEventListener('error', () => {
        const error = new NetworkError('文件上传失败')
        this.onError?.(error)
        reject(error)
      })

      xhr.open('POST', endpoint)
      xhr.send(formData)
    })
  }
}

// 搜索无结果友好提示
export interface SearchEmptyStateProps {
  query: string
  suggestions?: string[]
  onSuggestionClick?: (suggestion: string) => void
}

export function getSearchEmptyMessage(query: string): {
  title: string
  description: string
  suggestions: string[]
} {
  const trimmedQuery = query.trim()
  
  if (!trimmedQuery) {
    return {
      title: '开始搜索',
      description: '输入关键词来搜索文章内容',
      suggestions: ['React', 'Next.js', 'TypeScript', 'TailwindCSS']
    }
  }

  return {
    title: `没有找到关于 "${trimmedQuery}" 的结果`,
    description: '尝试使用不同的关键词或查看下面的建议',
    suggestions: [
      '检查拼写是否正确',
      '尝试使用更简短的关键词',
      '使用同义词或相关词汇',
      '浏览分类页面查找相关内容'
    ]
  }
}

// 通用错误边界处理
export function handleError(error: unknown, context?: string): AppError {
  console.error(`错误发生在: ${context || '未知位置'}`, error)

  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    return new AppError(
      error.message,
      ErrorType.CLIENT,
      'UNKNOWN_ERROR',
      500,
      { originalError: error, context }
    )
  }

  return new AppError(
    '发生了未知错误',
    ErrorType.CLIENT,
    'UNKNOWN_ERROR',
    500,
    { error, context }
  )
}

// 错误日志收集
export function logError(error: AppError | Error, additionalData?: any) {
  const errorData = {
    timestamp: new Date().toISOString(),
    message: error.message,
    stack: error.stack,
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...additionalData
  }

  if (error instanceof AppError) {
    Object.assign(errorData, {
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details
    })
  }

  // 发送到错误监控服务（生产环境）
  if (process.env.NODE_ENV === 'production') {
    // 这里可以集成 Sentry、LogRocket 等错误监控服务
    console.error('生产环境错误:', errorData)
  } else {
    console.error('开发环境错误:', errorData)
  }
}