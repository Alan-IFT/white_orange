/**
 * 性能监控和Core Web Vitals配置
 * 提供完整的性能监控、指标收集和分析功能
 */


// Core Web Vitals 阈值配置
export const WEB_VITALS_THRESHOLDS = {
  // Largest Contentful Paint (LCP) - 最大内容绘制
  LCP: {
    GOOD: 2500,     // <= 2.5s 为好
    NEEDS_IMPROVEMENT: 4000, // 2.5s - 4s 需要改进
    // > 4s 为差
  },
  // First Input Delay (FID) - 首次输入延迟
  FID: {
    GOOD: 100,      // <= 100ms 为好
    NEEDS_IMPROVEMENT: 300, // 100ms - 300ms 需要改进
    // > 300ms 为差
  },
  // Cumulative Layout Shift (CLS) - 累计布局偏移
  CLS: {
    GOOD: 0.1,      // <= 0.1 为好
    NEEDS_IMPROVEMENT: 0.25, // 0.1 - 0.25 需要改进
    // > 0.25 为差
  },
  // First Contentful Paint (FCP) - 首次内容绘制
  FCP: {
    GOOD: 1800,     // <= 1.8s 为好
    NEEDS_IMPROVEMENT: 3000, // 1.8s - 3s 需要改进
    // > 3s 为差
  },
  // Interaction to Next Paint (INP) - 交互到下次绘制
  INP: {
    GOOD: 200,      // <= 200ms 为好
    NEEDS_IMPROVEMENT: 500, // 200ms - 500ms 需要改进
    // > 500ms 为差
  },
  // Time to First Byte (TTFB) - 首字节时间
  TTFB: {
    GOOD: 800,      // <= 800ms 为好
    NEEDS_IMPROVEMENT: 1800, // 800ms - 1.8s 需要改进
    // > 1.8s 为差
  }
} as const

// 性能指标类型定义
export interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
  url: string
  connection?: string
  deviceMemory?: number
}

// 内存使用监控参数
export const MEMORY_MONITORING_CONFIG = {
  // 内存使用警告阈值 (MB)
  WARNING_THRESHOLD: 100,
  // 内存使用严重阈值 (MB)
  CRITICAL_THRESHOLD: 200,
  // 监控间隔 (毫秒)
  MONITORING_INTERVAL: 30000,
  // GC 压力阈值
  GC_PRESSURE_THRESHOLD: 0.8
} as const

// 慢查询日志配置
export const SLOW_QUERY_CONFIG = {
  // 慢查询阈值 (毫秒)
  SLOW_THRESHOLD: 1000,
  // 超慢查询阈值 (毫秒)
  VERY_SLOW_THRESHOLD: 3000,
  // 日志批量发送大小
  BATCH_SIZE: 10,
  // 发送间隔 (毫秒)
  FLUSH_INTERVAL: 60000
} as const

// 错误日志收集配置
export const ERROR_LOGGING_CONFIG = {
  // 最大错误堆栈深度
  MAX_STACK_DEPTH: 50,
  // 错误采样率 (0-1)
  SAMPLING_RATE: 1.0,
  // 批量发送大小
  BATCH_SIZE: 5,
  // 发送间隔 (毫秒)
  FLUSH_INTERVAL: 30000,
  // 最大错误数量 (防止内存泄漏)
  MAX_ERRORS: 100
} as const

// 性能评级函数
export function getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[metricName as keyof typeof WEB_VITALS_THRESHOLDS]
  
  if (!thresholds) return 'poor'
  
  if (value <= thresholds.GOOD) return 'good'
  if (value <= thresholds.NEEDS_IMPROVEMENT) return 'needs-improvement'
  return 'poor'
}

// Web Vitals 监控类
export class WebVitalsMonitor {
  private metrics: PerformanceMetric[] = []
  private observers: PerformanceObserver[] = []

  constructor() {
    this.initializeMonitoring()
  }

  private initializeMonitoring() {
    // 监控 LCP
    this.observeMetric('largest-contentful-paint', (entries) => {
      const lcpEntry = entries[entries.length - 1]
      this.recordMetric('LCP', lcpEntry.startTime)
    })

    // 监控 FID
    this.observeMetric('first-input', (entries) => {
      const fidEntry = entries[0]
      this.recordMetric('FID', fidEntry.processingStart - fidEntry.startTime)
    })

    // 监控 CLS
    this.observeMetric('layout-shift', (entries) => {
      let clsValue = 0
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      this.recordMetric('CLS', clsValue)
    })

    // 监控 FCP
    this.observeMetric('paint', (entries) => {
      const fcpEntry = entries.find((entry: any) => entry.name === 'first-contentful-paint')
      if (fcpEntry) {
        this.recordMetric('FCP', fcpEntry.startTime)
      }
    })

    // 监控 INP (如果支持)
    if ('PerformanceEventTiming' in window) {
      this.observeMetric('event', (entries) => {
        const interactions = entries.filter((entry: any) => 
          ['pointerdown', 'keydown', 'click'].includes(entry.name)
        )
        
        if (interactions.length > 0) {
          const maxDuration = Math.max(...interactions.map((entry: any) => entry.duration))
          this.recordMetric('INP', maxDuration)
        }
      })
    }
  }

  private observeMetric(entryType: string, callback: (entries: any[]) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries())
      })
      
      observer.observe({ entryTypes: [entryType] })
      this.observers.push(observer)
    } catch (error) {
      console.warn(`无法监控 ${entryType} 指标:`, error)
    }
  }

  private recordMetric(name: string, value: number) {
    const metric: PerformanceMetric = {
      name,
      value,
      rating: getRating(name, value),
      timestamp: Date.now(),
      url: window.location.href,
      connection: (navigator as any).connection?.effectiveType,
      deviceMemory: (navigator as any).deviceMemory
    }

    this.metrics.push(metric)
    this.sendMetric(metric)
  }

  private sendMetric(metric: PerformanceMetric) {
    // 发送到分析服务
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(metric)
    } else {
      console.log('性能指标:', metric)
    }
  }

  private sendToAnalytics(metric: PerformanceMetric) {
    // 可以集成 Google Analytics 4, Vercel Analytics 等
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        metric_value: metric.value,
        metric_rating: metric.rating,
        custom_map: {
          metric_name: metric.name
        }
      })
    }

    // 发送到自定义分析端点
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric)
    }).catch(console.error)
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  public destroy() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    this.metrics = []
  }
}

// 内存监控类
export class MemoryMonitor {
  private isMonitoring = false
  private intervalId?: NodeJS.Timeout | undefined

  startMonitoring() {
    if (this.isMonitoring || !this.isMemoryAPISupported()) return

    this.isMonitoring = true
    this.intervalId = setInterval(() => {
      this.checkMemoryUsage()
    }, MEMORY_MONITORING_CONFIG.MONITORING_INTERVAL)
  }

  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
    }
    this.isMonitoring = false
  }

  private isMemoryAPISupported(): boolean {
    return 'memory' in performance
  }

  private checkMemoryUsage() {
    if (!this.isMemoryAPISupported()) return

    const memory = (performance as any).memory
    const usedMB = memory.usedJSHeapSize / 1024 / 1024
    const totalMB = memory.totalJSHeapSize / 1024 / 1024
    const limitMB = memory.jsHeapSizeLimit / 1024 / 1024

    const usage = {
      used: usedMB,
      total: totalMB,
      limit: limitMB,
      percentage: (usedMB / limitMB) * 100,
      timestamp: Date.now()
    }

    // 检查内存使用阈值
    if (usedMB > MEMORY_MONITORING_CONFIG.CRITICAL_THRESHOLD) {
      console.warn('内存使用严重超标:', usage)
      this.reportMemoryIssue('critical', usage)
    } else if (usedMB > MEMORY_MONITORING_CONFIG.WARNING_THRESHOLD) {
      console.warn('内存使用超出警告线:', usage)
      this.reportMemoryIssue('warning', usage)
    }

    // 检查 GC 压力
    const gcPressure = usage.percentage / 100
    if (gcPressure > MEMORY_MONITORING_CONFIG.GC_PRESSURE_THRESHOLD) {
      console.warn('GC 压力过大:', { gcPressure, usage })
    }
  }

  private reportMemoryIssue(level: 'warning' | 'critical', usage: any) {
    fetch('/api/analytics/memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, usage })
    }).catch(console.error)
  }
}

// 慢查询监控类
export class SlowQueryMonitor {
  private queryLogs: any[] = []
  private startTimes = new Map<string, number>()

  startQuery(queryId: string, _query: string, _params?: any) {
    this.startTimes.set(queryId, performance.now())
  }

  endQuery(queryId: string, _result?: any) {
    const startTime = this.startTimes.get(queryId)
    if (!startTime) return

    const duration = performance.now() - startTime
    this.startTimes.delete(queryId)

    if (duration > SLOW_QUERY_CONFIG.SLOW_THRESHOLD) {
      const log = {
        queryId,
        duration,
        timestamp: Date.now(),
        url: window.location.href,
        isSlow: duration > SLOW_QUERY_CONFIG.VERY_SLOW_THRESHOLD
      }

      this.queryLogs.push(log)
      this.flushLogsIfNeeded()

      if (duration > SLOW_QUERY_CONFIG.VERY_SLOW_THRESHOLD) {
        console.warn('检测到超慢查询:', log)
      }
    }
  }

  private flushLogsIfNeeded() {
    if (this.queryLogs.length >= SLOW_QUERY_CONFIG.BATCH_SIZE) {
      this.flushLogs()
    }
  }

  private flushLogs() {
    if (this.queryLogs.length === 0) return

    const logs = [...this.queryLogs]
    this.queryLogs = []

    fetch('/api/analytics/slow-queries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logs })
    }).catch(console.error)
  }
}

// 性能监控初始化函数
export function initializePerformanceMonitoring() {
  // 初始化 Web Vitals 监控
  const webVitalsMonitor = new WebVitalsMonitor()

  // 初始化内存监控
  const memoryMonitor = new MemoryMonitor()
  memoryMonitor.startMonitoring()

  // 初始化慢查询监控
  const slowQueryMonitor = new SlowQueryMonitor()

  // 页面卸载时清理资源
  window.addEventListener('beforeunload', () => {
    webVitalsMonitor.destroy()
    memoryMonitor.stopMonitoring()
  })

  // 导出监控实例供全局使用
  if (typeof window !== 'undefined') {
    (window as any).__performanceMonitors = {
      webVitals: webVitalsMonitor,
      memory: memoryMonitor,
      slowQuery: slowQueryMonitor
    }
  }

  return {
    webVitals: webVitalsMonitor,
    memory: memoryMonitor,
    slowQuery: slowQueryMonitor
  }
}

// 性能报告生成器
export class PerformanceReporter {
  static generateReport(metrics: PerformanceMetric[]) {
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: (navigator as any).connection?.effectiveType,
      deviceMemory: (navigator as any).deviceMemory,
      metrics: this.analyzeMetrics(metrics),
      recommendations: this.generateRecommendations(metrics)
    }

    return report
  }

  private static analyzeMetrics(metrics: PerformanceMetric[]) {
    const analysis: any = {}

    metrics.forEach(metric => {
      if (!analysis[metric.name]) {
        analysis[metric.name] = {
          values: [],
          ratings: { good: 0, 'needs-improvement': 0, poor: 0 }
        }
      }

      analysis[metric.name].values.push(metric.value)
      analysis[metric.name].ratings[metric.rating]++
    })

    // 计算统计数据
    Object.keys(analysis).forEach(metricName => {
      const values = analysis[metricName].values
      analysis[metricName].stats = {
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((a: number, b: number) => a + b, 0) / values.length,
        median: this.calculateMedian(values)
      }
    })

    return analysis
  }

  private static calculateMedian(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    if (sorted.length % 2 === 0) {
      const left = sorted[mid - 1]
      const right = sorted[mid]
      return left !== undefined && right !== undefined ? (left + right) / 2 : 0
    } else {
      const value = sorted[mid]
      return value !== undefined ? value : 0
    }
  }

  private static generateRecommendations(metrics: PerformanceMetric[]): string[] {
    const recommendations: string[] = []
    const analysis = this.analyzeMetrics(metrics)

    // LCP 优化建议
    if (analysis.LCP?.stats.avg > WEB_VITALS_THRESHOLDS.LCP.GOOD) {
      recommendations.push(
        '优化 LCP: 考虑优化图片加载、减少服务器响应时间、使用 CDN'
      )
    }

    // FID 优化建议
    if (analysis.FID?.stats.avg > WEB_VITALS_THRESHOLDS.FID.GOOD) {
      recommendations.push(
        '优化 FID: 减少 JavaScript 执行时间、拆分长任务、优化第三方脚本'
      )
    }

    // CLS 优化建议
    if (analysis.CLS?.stats.avg > WEB_VITALS_THRESHOLDS.CLS.GOOD) {
      recommendations.push(
        '优化 CLS: 为图片和视频设置尺寸属性、避免在现有内容上方插入内容'
      )
    }

    return recommendations
  }
}