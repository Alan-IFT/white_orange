/**
 * 示例 E2E 测试 - Playwright 端到端测试
 * 演示页面导航、用户交互、性能测试等
 */

import { test, expect, Page } from '@playwright/test'

test.describe('博客首页', () => {
  test('应该正确加载并显示主要内容', async ({ page }) => {
    await page.goto('/')
    
    // 检查页面标题
    await expect(page).toHaveTitle(/博客|Blog/)
    
    // 检查主要导航
    const navigation = page.locator('nav')
    await expect(navigation).toBeVisible()
    
    // 检查主要内容区域
    const main = page.locator('main')
    await expect(main).toBeVisible()
    
    // 检查页脚
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })
  
  test('导航链接应该正常工作', async ({ page }) => {
    await page.goto('/')
    
    // 测试博客链接
    await page.click('text=博客')
    await expect(page).toHaveURL(/\/blog/)
    
    // 返回首页
    await page.click('text=首页')
    await expect(page).toHaveURL('/')
    
    // 测试关于页面
    await page.click('text=关于')
    await expect(page).toHaveURL(/\/about/)
  })
  
  test('搜索功能应该工作', async ({ page }) => {
    await page.goto('/')
    
    // 查找搜索框
    const searchBox = page.locator('input[type="search"], input[placeholder*="搜索"]')
    
    if (await searchBox.count() > 0) {
      // 输入搜索关键词
      await searchBox.fill('React')
      await page.keyboard.press('Enter')
      
      // 等待搜索结果
      await page.waitForLoadState('networkidle')
      
      // 检查是否有搜索结果或搜索页面
      const hasResults = await page.locator('text=搜索结果').count() > 0
      const hasSearchPage = page.url().includes('search')
      
      expect(hasResults || hasSearchPage).toBeTruthy()
    }
  })
})

test.describe('博客列表页', () => {
  test('应该显示文章列表', async ({ page }) => {
    await page.goto('/blog')
    
    // 等待内容加载
    await page.waitForLoadState('networkidle')
    
    // 检查是否有文章卡片或文章列表
    const articles = page.locator('article, .post, .blog-item')
    
    if (await articles.count() > 0) {
      // 如果有文章，检查文章元素
      const firstArticle = articles.first()
      await expect(firstArticle).toBeVisible()
      
      // 检查文章标题
      const title = firstArticle.locator('h1, h2, h3, .title')
      await expect(title.first()).toBeVisible()
    } else {
      // 如果没有文章，应该显示空状态
      const emptyState = page.locator('text=暂无文章, text=No posts, .empty')
      await expect(emptyState.first()).toBeVisible()
    }
  })
  
  test('分页功能应该工作', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')
    
    // 查找分页元素
    const pagination = page.locator('.pagination, nav[aria-label*="分页"], nav[aria-label*="pagination"]')
    
    if (await pagination.count() > 0) {
      const nextButton = pagination.locator('text=下一页, text=Next, [aria-label*="next"]')
      
      if (await nextButton.count() > 0 && await nextButton.isEnabled()) {
        await nextButton.click()
        await page.waitForLoadState('networkidle')
        
        // 检查 URL 是否改变
        expect(page.url()).toMatch(/page=2|p=2|\/2/)
      }
    }
  })
})

test.describe('文章详情页', () => {
  test('应该正确显示文章内容', async ({ page }) => {
    // 先访问博客列表
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')
    
    // 查找第一篇文章链接
    const firstArticleLink = page.locator('article a, .post a, .blog-item a').first()
    
    if (await firstArticleLink.count() > 0) {
      await firstArticleLink.click()
      await page.waitForLoadState('networkidle')
      
      // 检查文章标题
      const title = page.locator('h1')
      await expect(title).toBeVisible()
      
      // 检查文章内容
      const content = page.locator('main, .content, .post-content')
      await expect(content).toBeVisible()
      
      // 检查文章元数据（日期、作者等）
      const metadata = page.locator('.date, .author, .post-meta, time')
      await expect(metadata.first()).toBeVisible()
    }
  })
  
  test('代码块应该正确高亮', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')
    
    const firstArticleLink = page.locator('article a, .post a').first()
    
    if (await firstArticleLink.count() > 0) {
      await firstArticleLink.click()
      await page.waitForLoadState('networkidle')
      
      // 查找代码块
      const codeBlocks = page.locator('pre code, .highlight')
      
      if (await codeBlocks.count() > 0) {
        const firstCodeBlock = codeBlocks.first()
        await expect(firstCodeBlock).toBeVisible()
        
        // 检查是否有语法高亮样式
        const hasHighlight = await firstCodeBlock.evaluate(el => {
          const styles = window.getComputedStyle(el)
          return styles.color !== 'rgb(0, 0, 0)' || el.querySelector('.token, .hljs-keyword') !== null
        })
        
        expect(hasHighlight).toBeTruthy()
      }
    }
  })
})

test.describe('响应式设计', () => {
  test('在移动设备上应该正确显示', async ({ page }) => {
    // 设置移动设备视口
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // 检查移动导航
    const mobileNav = page.locator('.mobile-nav, .hamburger, [aria-label*="menu"]')
    
    if (await mobileNav.count() > 0) {
      await expect(mobileNav.first()).toBeVisible()
      
      // 点击移动菜单
      await mobileNav.first().click()
      
      // 检查菜单是否展开
      const navMenu = page.locator('.nav-menu, .mobile-menu')
      if (await navMenu.count() > 0) {
        await expect(navMenu.first()).toBeVisible()
      }
    }
  })
  
  test('在平板设备上应该正确显示', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    
    // 检查布局是否适配平板
    const main = page.locator('main')
    await expect(main).toBeVisible()
    
    // 检查侧边栏或导航在平板上的显示
    const sidebar = page.locator('.sidebar, aside')
    if (await sidebar.count() > 0) {
      await expect(sidebar.first()).toBeVisible()
    }
  })
})

test.describe('暗黑模式', () => {
  test('应该支持主题切换', async ({ page }) => {
    await page.goto('/')
    
    // 查找主题切换按钮
    const themeToggle = page.locator('[aria-label*="theme"], .theme-toggle, .dark-mode-toggle')
    
    if (await themeToggle.count() > 0) {
      // 获取当前主题
      const initialTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') || 
               document.documentElement.getAttribute('data-theme') === 'dark'
      })
      
      // 切换主题
      await themeToggle.first().click()
      
      // 等待主题切换完成
      await page.waitForTimeout(300)
      
      // 检查主题是否改变
      const newTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') || 
               document.documentElement.getAttribute('data-theme') === 'dark'
      })
      
      expect(newTheme).not.toBe(initialTheme)
    }
  })
})

test.describe('性能测试', () => {
  test('页面加载性能应该达标', async ({ page }) => {
    // 开始性能监控
    await page.goto('/', { waitUntil: 'networkidle' })
    
    // 获取性能指标
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      return {
        // 首字节时间
        ttfb: navigation.responseStart - navigation.fetchStart,
        // 页面完全加载时间
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
        // DOM 解析时间
        domParseTime: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        // 资源加载时间
        resourceTime: navigation.loadEventEnd - navigation.domContentLoadedEventEnd,
      }
    })
    
    // 性能断言
    expect(metrics.ttfb).toBeLessThan(1000) // TTFB < 1s
    expect(metrics.loadTime).toBeLessThan(3000) // 总加载时间 < 3s
    expect(metrics.domParseTime).toBeLessThan(500) // DOM 解析 < 500ms
    
    console.log('性能指标:', metrics)
  })
  
  test('Core Web Vitals 应该优秀', async ({ page }) => {
    await page.goto('/')
    
    // 等待页面稳定
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    // 获取 Core Web Vitals
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals: any = {}
        
        // LCP - Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          if (entries.length > 0) {
            vitals.lcp = entries[entries.length - 1].startTime
          }
        }).observe({ entryTypes: ['largest-contentful-paint'] })
        
        // CLS - Cumulative Layout Shift
        new PerformanceObserver((list) => {
          let clsValue = 0
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
            }
          }
          vitals.cls = clsValue
        }).observe({ entryTypes: ['layout-shift'] })
        
        setTimeout(() => resolve(vitals), 3000)
      })
    })
    
    console.log('Core Web Vitals:', vitals)
    
    // 断言 Core Web Vitals
    if (vitals.lcp) {
      expect(vitals.lcp).toBeLessThan(2500) // LCP < 2.5s
    }
    if (vitals.cls !== undefined) {
      expect(vitals.cls).toBeLessThan(0.1) // CLS < 0.1
    }
  })
})

test.describe('SEO 检查', () => {
  test('应该有正确的 meta 标签', async ({ page }) => {
    await page.goto('/')
    
    // 检查标题
    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(10)
    expect(title.length).toBeLessThan(60)
    
    // 检查 meta description
    const description = await page.getAttribute('meta[name="description"]', 'content')
    expect(description).toBeTruthy()
    expect(description.length).toBeGreaterThan(50)
    expect(description.length).toBeLessThan(160)
    
    // 检查 canonical URL
    const canonical = await page.getAttribute('link[rel="canonical"]', 'href')
    if (canonical) {
      expect(canonical).toMatch(/^https?:\/\//)
    }
    
    // 检查 Open Graph 标签
    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content')
    const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content')
    const ogImage = await page.getAttribute('meta[property="og:image"]', 'content')
    
    expect(ogTitle).toBeTruthy()
    expect(ogDescription).toBeTruthy()
    if (ogImage) {
      expect(ogImage).toMatch(/^https?:\/\//)
    }
  })
  
  test('应该有结构化数据', async ({ page }) => {
    await page.goto('/')
    
    // 检查 JSON-LD 结构化数据
    const jsonLd = await page.locator('script[type="application/ld+json"]')
    
    if (await jsonLd.count() > 0) {
      const jsonContent = await jsonLd.first().textContent()
      expect(() => JSON.parse(jsonContent || '')).not.toThrow()
      
      const data = JSON.parse(jsonContent || '{}')
      expect(data['@type']).toBeTruthy()
    }
  })
})

test.describe('可访问性测试', () => {
  test('应该通过基本的可访问性检查', async ({ page }) => {
    await page.goto('/')
    
    // 检查页面是否有正确的语言属性
    const lang = await page.getAttribute('html', 'lang')
    expect(lang).toBeTruthy()
    
    // 检查是否有跳转到主内容的链接
    const skipLink = page.locator('a[href="#main"], a[href="#content"]')
    if (await skipLink.count() > 0) {
      await expect(skipLink.first()).toBeVisible()
    }
    
    // 检查标题层级
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents()
    expect(headings.length).toBeGreaterThan(0)
    
    // 检查图片是否有 alt 属性
    const images = page.locator('img')
    const imageCount = await images.count()
    
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      const ariaLabel = await img.getAttribute('aria-label')
      const role = await img.getAttribute('role')
      
      // 图片应该有 alt 属性，或者是装饰性图片
      expect(alt !== null || ariaLabel !== null || role === 'presentation').toBeTruthy()
    }
  })
  
  test('键盘导航应该工作', async ({ page }) => {
    await page.goto('/')
    
    // 测试 Tab 键导航
    let focusedElement = await page.locator(':focus').first()
    let previousFocus = ''
    
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
      await page.waitForTimeout(100)
      
      focusedElement = page.locator(':focus').first()
      
      if (await focusedElement.count() > 0) {
        const currentFocus = await focusedElement.evaluate(el => el.tagName + (el.textContent || el.getAttribute('aria-label') || '').slice(0, 20))
        
        // 确保焦点在移动
        expect(currentFocus).not.toBe(previousFocus)
        previousFocus = currentFocus
        
        // 确保焦点元素可见
        await expect(focusedElement).toBeVisible()
      }
    }
  })
})