// 全局类型声明
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'consent',
      targetId: string | Date,
      config?: any
    ) => void
  }
}

export {}