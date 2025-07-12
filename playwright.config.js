/**
 * Playwright E2E 测试配置 - 生产级端到端测试
 * 支持多浏览器、移动端、性能测试
 */

import { defineConfig, devices } from '@playwright/test'

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 测试目录
  testDir: './e2e',
  
  // 每个测试文件的超时时间
  timeout: 30 * 1000,
  
  // 断言超时时间
  expect: {
    timeout: 5000,
  },
  
  // 并行运行配置
  fullyParallel: true,
  
  // CI 环境下失败时不重试
  retries: process.env.CI ? 2 : 0,
  
  // CI 环境下的并发数
  workers: process.env.CI ? 1 : undefined,
  
  // 报告器配置
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['line'],
  ],
  
  // 共享设置
  use: {
    // 基础 URL
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    
    // 追踪配置 - 失败时记录
    trace: 'on-first-retry',
    
    // 截图配置
    screenshot: 'only-on-failure',
    
    // 视频录制
    video: 'retain-on-failure',
    
    // 浏览器上下文选项
    viewport: { width: 1280, height: 720 },
    
    // 忽略 HTTPS 错误
    ignoreHTTPSErrors: true,
    
    // 用户代理
    userAgent: 'Playwright E2E Tests',
    
    // 语言环境
    locale: 'zh-CN',
    
    // 时区
    timezoneId: 'Asia/Shanghai',
    
    // 权限
    permissions: ['clipboard-read', 'clipboard-write'],
    
    // 颜色方案
    colorScheme: 'light',
    
    // 减少动画
    reducedMotion: 'reduce',
  },
  
  // 测试项目配置
  projects: [
    // 桌面浏览器
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // 移动设备
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    
    // 平板设备
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro'] },
    },
    
    // 高分辨率桌面
    {
      name: 'Desktop High DPI',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 2,
      },
    },
    
    // 暗色主题测试
    {
      name: 'Dark Mode',
      use: {
        ...devices['Desktop Chrome'],
        colorScheme: 'dark',
      },
    },
    
    // 性能测试配置
    {
      name: 'Performance',
      use: {
        ...devices['Desktop Chrome'],
        // 启用性能指标收集
        launchOptions: {
          args: ['--enable-precise-memory-info'],
        },
      },
      testMatch: /.*performance.*\.spec\.ts/,
    },
    
    // 可访问性测试
    {
      name: 'Accessibility',
      use: {
        ...devices['Desktop Chrome'],
        // 启用辅助功能
        extraHTTPHeaders: {
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        },
      },
      testMatch: /.*a11y.*\.spec\.ts/,
    },
  ],
  
  // Web 服务器配置
  webServer: {
    command: process.env.CI ? 'npm run start' : 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      NODE_ENV: process.env.CI ? 'production' : 'development',
      NEXT_OUTPUT_MODE: 'standalone',
    },
  },
  
  // 输出目录
  outputDir: 'test-results',
  
  // 全局设置
  globalSetup: require.resolve('./e2e/global-setup.ts'),
  globalTeardown: require.resolve('./e2e/global-teardown.ts'),
  
  // 测试忽略模式
  testIgnore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.next/**',
    '**/coverage/**',
  ],
  
  // 元数据
  metadata: {
    platform: process.platform,
    node: process.version,
    timestamp: new Date().toISOString(),
  },
  
  // 实验性功能
  experimental: {
    // 启用并行测试
    fullyParallel: true,
  },
})