'use client'

import { useEffect } from 'react'
import { 
  initializePerformanceMonitoring,
  WebVitalsMonitor
} from '@/lib/performance-monitoring'

interface PerformanceMonitorProps {
  children: React.ReactNode
}

export default function PerformanceMonitor({ children }: PerformanceMonitorProps) {
  useEffect(() => {
    // 仅在生产环境和浏览器环境中启用
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
      return
    }

    let cleanup: (() => void) | undefined

    const initMonitoring = async (): Promise<void> => {
      try {
        // 初始化性能监控
        await initializePerformanceMonitoring()

        // 启动监控（已在初始化函数中完成）

        // 页面卸载时报告数据
        const handleBeforeUnload = () => {
          // 使用 sendBeacon 确保数据能够发送
          if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
            // 这里可以发送最终的性能数据
          }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        // 清理函数
        cleanup = () => {
          window.removeEventListener('beforeunload', handleBeforeUnload)
        }
      } catch (error) {
        console.warn('Performance monitoring initialization failed:', error)
      }
    }

    // 延迟初始化，避免影响页面加载
    const timer = setTimeout(initMonitoring, 1000)

    return () => {
      clearTimeout(timer)
      cleanup?.()
    }
  }, [])

  return <>{children}</>
}

// Web Vitals 报告钩子 - 简化版
export function useWebVitals() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'PerformanceObserver' in window) {
      // 使用原生 Performance API
      new WebVitalsMonitor()
      // 监控器会自动开始工作
    }
  }, [])
}