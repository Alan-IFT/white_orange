'use client'

// 简单的 toast 实现
export interface ToastOptions {
  title?: string
  description?: string
  variant?: 'default' | 'success' | 'error' | 'warning'
  duration?: number
}

// 简单的 toast 函数
export function toast(options: ToastOptions | string) {
  // 在浏览器环境中显示通知
  if (typeof window === 'undefined') return

  const message = typeof options === 'string' ? options : options.title || options.description || ''
  
  // 使用原生浏览器通知（如果可能）
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(message, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
    })
  } else {
    // 降级到控制台输出（开发环境）或者简单的alert
    if (process.env.NODE_ENV === 'development') {
      console.log('Toast:', message)
    }
  }
}

// Toast 上下文（暂时为空实现）
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export default toast