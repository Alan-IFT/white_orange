'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Google Analytics 配置
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID


// 页面浏览事件
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// 事件跟踪
export const event = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    })
  }
}

// Google Analytics 组件
export default function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (!GA_TRACKING_ID) return

    // 加载 Google Analytics
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      window.gtag = window.gtag || function (...args: any[]) {
        (window.gtag as any).q = (window.gtag as any).q || []
        ;(window.gtag as any).q.push(args)
      }
      window.gtag('js', new Date())
      window.gtag('config', GA_TRACKING_ID, {
        page_path: pathname,
        anonymize_ip: true,
      })
    }

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  // 路由变化时跟踪页面浏览
  useEffect(() => {
    if (GA_TRACKING_ID && pathname) {
      pageview(pathname)
    }
  }, [pathname])

  return null
}

// 用于跟踪特定事件的钩子
export function useAnalytics() {
  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    event(action, category, label, value)
  }

  const trackPageView = (url: string) => {
    pageview(url)
  }

  return { trackEvent, trackPageView }
}

// Vercel Analytics 组件
export function VercelAnalytics() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_VERCEL_ANALYTICS) {
      // 简单的分析事件追踪（不依赖外部包）
      const trackPageView = () => {
        if (window.gtag) {
          window.gtag('config', GA_TRACKING_ID || '', {
            page_path: window.location.pathname,
          })
        }
      }

      // 跟踪页面浏览
      trackPageView()
    }
  }, [])

  return null
}

// Web Vitals 报告
export function WebVitalsReporter() {
  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
      return
    }

    // 报告 Core Web Vitals
    const reportWebVitals = (metric: any) => {
      event('web_vitals', 'performance', metric.name, Math.round(metric.value))
      
      // 也可以发送到其他分析服务
      if (window.gtag) {
        window.gtag('event', metric.name, {
          custom_map: { metric_value: 'custom_metric' },
          custom_metric: metric.value,
        })
      }
    }

    // 使用 PerformanceObserver API 来监控性能指标
    if ('PerformanceObserver' in window) {
      try {
        // 监控 LCP (Largest Contentful Paint)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          if (lastEntry) {
            reportWebVitals({
              name: 'LCP',
              value: lastEntry.startTime,
            })
          }
        })
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })

        // 监控 FID (First Input Delay)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            reportWebVitals({
              name: 'FID',
              value: (entry as any).processingStart - entry.startTime,
            })
          })
        })
        fidObserver.observe({ type: 'first-input', buffered: true })

        // 监控 CLS (Cumulative Layout Shift)
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
            }
          })
          reportWebVitals({
            name: 'CLS',
            value: clsValue,
          })
        })
        clsObserver.observe({ type: 'layout-shift', buffered: true })

      } catch (error) {
        console.warn('Performance observation setup failed:', error)
      }
    }
  }, [])

  return null
}