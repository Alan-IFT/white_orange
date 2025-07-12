import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 格式化日期
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * 计算阅读时间
 */
export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200 // 中文阅读速度
  const words = content.length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} 分钟`
}

/**
 * 生成摘要
 */
export function generateExcerpt(content: string, maxLength: number = 150): string {
  const cleaned = content.replace(/[#*`\[\]]/g, '').trim()
  if (cleaned.length <= maxLength) return cleaned
  return cleaned.slice(0, maxLength) + '...'
}

/**
 * URL slug 化
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 获取相对时间
 */
export function getRelativeTime(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000)

  if (diffInSeconds < 60) return '刚刚'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} 分钟前`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} 小时前`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} 天前`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} 个月前`
  return `${Math.floor(diffInSeconds / 31536000)} 年前`
}