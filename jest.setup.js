/**
 * Jest 测试环境设置 - React 19.1.0+ 兼容
 * 配置测试工具和全局模拟
 */

import '@testing-library/jest-dom'

// React 19 测试兼容性设置
import { configure } from '@testing-library/react'

// 配置 React Testing Library
configure({
  // React 19 的新特性支持
  asyncUtilTimeout: 5000,
  computedStyleSupportsPseudoElements: true,
})

// 全局模拟 - Next.js Router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// 模拟 Next.js Navigation (App Router)
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// 模拟 Next.js Image 组件
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// 模拟 Next.js Link 组件
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }) => {
    return <a href={href} {...props}>{children}</a>
  },
}))

// 模拟环境变量
process.env.NEXT_PUBLIC_SITE_NAME = 'Test Blog'
process.env.NEXT_PUBLIC_SITE_URL = 'https://test.example.com'
process.env.NEXT_PUBLIC_AUTHOR_NAME = 'Test Author'
process.env.NEXT_PUBLIC_AUTHOR_EMAIL = 'test@example.com'

// 模拟 window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// 模拟 IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  
  disconnect() {
    return null
  }
  
  observe() {
    return null
  }
  
  unobserve() {
    return null
  }
}

// 模拟 ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  
  disconnect() {
    return null
  }
  
  observe() {
    return null
  }
  
  unobserve() {
    return null
  }
}

// 模拟 requestAnimationFrame
global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0)
}

global.cancelAnimationFrame = (id) => {
  clearTimeout(id)
}

// 模拟 localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// 模拟 sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.sessionStorage = sessionStorageMock

// 模拟 fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
)

// 错误处理 - 防止测试中的 unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason)
})

// React 19 新特性模拟
global.ReactDOMTestUtils = {
  act: (callback) => {
    return new Promise((resolve) => {
      callback()
      setTimeout(resolve, 0)
    })
  }
}

// 模拟 Web APIs
global.URL.createObjectURL = jest.fn(() => 'mocked-url')
global.URL.revokeObjectURL = jest.fn()

// 模拟 performance API
global.performance.mark = jest.fn()
global.performance.measure = jest.fn()
global.performance.getEntriesByName = jest.fn(() => [])
global.performance.getEntriesByType = jest.fn(() => [])

// 清理函数 - 每个测试后运行
afterEach(() => {
  // 清理模拟调用记录
  jest.clearAllMocks()
  
  // 清理 localStorage
  localStorageMock.clear()
  sessionStorageMock.clear()
  
  // 清理 fetch 模拟
  if (global.fetch && global.fetch.mockClear) {
    global.fetch.mockClear()
  }
})

// 全局测试设置
beforeAll(() => {
  // 静默 console.error 和 console.warn，除非是测试相关的
  const originalError = console.error
  const originalWarn = console.warn
  
  console.error = (...args) => {
    const message = args[0]
    if (
      typeof message === 'string' &&
      (message.includes('Warning:') || 
       message.includes('Error:') ||
       message.includes('Failed prop type'))
    ) {
      originalError(...args)
    }
  }
  
  console.warn = (...args) => {
    const message = args[0]
    if (
      typeof message === 'string' &&
      message.includes('Warning:')
    ) {
      originalWarn(...args)
    }
  }
})

// 自定义匹配器示例
expect.extend({
  toHaveValidMarkdown(received) {
    const pass = typeof received === 'string' && received.length > 0
    return {
      message: () => `expected ${received} to be valid markdown`,
      pass,
    }
  },
})