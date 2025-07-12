/**
 * Jest 配置文件 - Next.js 15.3.5+ & React 19.1.0+ 兼容
 * 基于官方文档和最新最佳实践
 */

const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // 提供 Next.js 应用程序的路径，用于加载 next.config.js 和 .env 文件
  dir: './',
})

// Jest 的自定义配置
const customJestConfig = {
  // 设置测试环境
  testEnvironment: 'jsdom',
  
  // 模块路径映射，与 tsconfig.json 保持一致
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '^@/content/(.*)$': '<rootDir>/content/$1',
    '^@/public/(.*)$': '<rootDir>/public/$1',
  },
  
  // 设置文件路径
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // 测试文件匹配模式
  testMatch: [
    '<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/components/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/lib/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/app/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  
  // 忽略的文件和目录
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/out/',
    '<rootDir>/e2e/', // E2E 测试由 Playwright 处理
  ],
  
  // 转换配置
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  
  // 模块文件扩展名
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // 覆盖率配置
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/coverage/**',
    '!**/.next/**',
    '!**/out/**',
  ],
  
  // 覆盖率阈值
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // 覆盖率报告格式
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  
  // 覆盖率输出目录
  coverageDirectory: 'coverage',
  
  // 模拟文件处理
  moduleNameMapping: {
    // 样式文件模拟
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    
    // 图片文件模拟
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
  },
  
  // 全局变量
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react-jsx',
      },
    },
  },
  
  // 测试超时时间
  testTimeout: 10000,
  
  // 最大并发数
  maxConcurrency: 5,
  
  // 清除模拟调用
  clearMocks: true,
  
  // 重置模块注册表
  resetMocks: true,
  
  // 恢复模拟实现
  restoreMocks: true,
  
  // 详细输出
  verbose: true,
  
  // 错误时不退出
  bail: false,
  
  // 监听文件变化
  watchman: true,
  
  // 性能监控
  detectOpenHandles: true,
  
  // 强制退出延迟 (毫秒)
  forceExit: false,
  
  // 报告器配置
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './test-results',
      outputName: 'junit.xml',
    }],
  ],
  
  // 自定义解析器
  resolver: '<rootDir>/jest.resolver.js',
}

// 创建并导出 Jest 配置
module.exports = createJestConfig(customJestConfig)