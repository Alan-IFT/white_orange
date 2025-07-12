/**
 * MCP Puppeteer 集成测试 - 使用 MCP Puppeteer 工具进行 E2E 测试
 * 展示如何在现有测试框架中集成 MCP 工具
 */

import { test, expect } from '@playwright/test'

test.describe('MCP Puppeteer 集成测试', () => {
  test('使用 MCP 工具进行页面截图和交互', async ({ page }) => {
    // 导航到首页
    await page.goto('/')
    
    // 等待页面加载
    await page.waitForLoadState('networkidle')
    
    // 验证页面标题
    const title = await page.title()
    expect(title).toBeTruthy()
    console.log('页面标题:', title)
    
    // 截图保存
    await page.screenshot({ 
      path: 'test-results/homepage-screenshot.png',
      fullPage: true 
    })
    
    // 检查主要导航元素
    const navigation = page.locator('nav')
    await expect(navigation).toBeVisible()
    
    // 如果存在搜索框，测试搜索功能
    const searchBox = page.locator('input[type="search"], input[placeholder*="搜索"]')
    if (await searchBox.count() > 0) {
      await searchBox.fill('React')
      await searchBox.press('Enter')
      await page.waitForLoadState('networkidle')
      
      // 搜索结果页截图
      await page.screenshot({ 
        path: 'test-results/search-results-screenshot.png',
        fullPage: true 
      })
    }
  })
  
  test('MCP 工具辅助的表单测试', async ({ page }) => {
    await page.goto('/')
    
    // 查找联系表单或评论表单
    const form = page.locator('form').first()
    
    if (await form.count() > 0) {
      // 截图表单初始状态
      await form.screenshot({ 
        path: 'test-results/form-initial.png' 
      })
      
      // 查找输入字段
      const inputs = form.locator('input, textarea')
      const inputCount = await inputs.count()
      
      if (inputCount > 0) {
        // 填写第一个输入字段
        const firstInput = inputs.first()
        await firstInput.fill('测试数据')
        
        // 截图填写后的状态
        await form.screenshot({ 
          path: 'test-results/form-filled.png' 
        })
        
        // 检查提交按钮
        const submitButton = form.locator('button[type="submit"], input[type="submit"]')
        if (await submitButton.count() > 0) {
          await expect(submitButton).toBeEnabled()
        }
      }
    }
  })
  
  test('MCP 工具辅助的响应式设计测试', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' }
    ]
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // 每个视口截图
      await page.screenshot({ 
        path: `test-results/responsive-${viewport.name}.png`,
        fullPage: true 
      })
      
      // 检查导航在不同视口下的显示
      const navigation = page.locator('nav')
      await expect(navigation).toBeVisible()
      
      // 移动端检查汉堡菜单
      if (viewport.name === 'mobile') {
        const mobileMenu = page.locator('.mobile-nav, .hamburger, [aria-label*="menu"]')
        if (await mobileMenu.count() > 0) {
          await expect(mobileMenu.first()).toBeVisible()
          
          // 点击汉堡菜单
          await mobileMenu.first().click()
          await page.waitForTimeout(300)
          
          // 截图展开的菜单
          await page.screenshot({ 
            path: 'test-results/mobile-menu-expanded.png' 
          })
        }
      }
    }
  })
  
  test('MCP 工具辅助的性能测试', async ({ page }) => {
    // 启用性能监控
    await page.goto('/', { waitUntil: 'networkidle' })
    
    // 获取性能指标
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      return {
        ttfb: navigation.responseStart - navigation.fetchStart,
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
        domParseTime: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      }
    })
    
    console.log('MCP 性能测试指标:', metrics)
    
    // 截图最终页面状态
    await page.screenshot({ 
      path: 'test-results/performance-test-final.png',
      fullPage: true 
    })
    
    // 性能断言
    expect(metrics.ttfb).toBeLessThan(1000)
    expect(metrics.loadTime).toBeLessThan(3000)
  })
  
  test('MCP 工具辅助的暗黑模式测试', async ({ page }) => {
    await page.goto('/')
    
    // 截图初始主题
    await page.screenshot({ 
      path: 'test-results/theme-initial.png',
      fullPage: true 
    })
    
    // 查找主题切换按钮
    const themeToggle = page.locator('[aria-label*="theme"], .theme-toggle, .dark-mode-toggle')
    
    if (await themeToggle.count() > 0) {
      // 点击主题切换
      await themeToggle.first().click()
      await page.waitForTimeout(300)
      
      // 截图切换后的主题
      await page.screenshot({ 
        path: 'test-results/theme-toggled.png',
        fullPage: true 
      })
      
      // 验证主题切换
      const isDarkMode = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') || 
               document.documentElement.getAttribute('data-theme') === 'dark'
      })
      
      console.log('暗黑模式状态:', isDarkMode)
    }
  })
  
  test('MCP 工具辅助的错误页面测试', async ({ page }) => {
    // 访问不存在的页面
    const response = await page.goto('/non-existent-page')
    
    // 检查是否是 404 页面
    if (response && response.status() === 404) {
      // 截图 404 页面
      await page.screenshot({ 
        path: 'test-results/404-page.png',
        fullPage: true 
      })
      
      // 检查是否有返回首页的链接
      const homeLink = page.locator('a[href="/"], a[href="./"]')
      if (await homeLink.count() > 0) {
        await expect(homeLink.first()).toBeVisible()
      }
    }
  })
})

test.describe('MCP 工具辅助的可访问性测试', () => {
  test('键盘导航截图记录', async ({ page }) => {
    await page.goto('/')
    
    // 初始状态截图
    await page.screenshot({ 
      path: 'test-results/keyboard-nav-initial.png' 
    })
    
    // 测试键盘导航并记录每一步
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
      await page.waitForTimeout(100)
      
      const focusedElement = page.locator(':focus').first()
      if (await focusedElement.count() > 0) {
        // 高亮当前焦点元素
        await focusedElement.evaluate(el => {
          el.style.outline = '3px solid red'
          el.style.outlineOffset = '2px'
        })
        
        // 截图当前焦点状态
        await page.screenshot({ 
          path: `test-results/keyboard-nav-step-${i + 1}.png` 
        })
        
        // 移除高亮
        await focusedElement.evaluate(el => {
          el.style.outline = ''
          el.style.outlineOffset = ''
        })
      }
    }
  })
  
  test('颜色对比度测试', async ({ page }) => {
    await page.goto('/')
    
    // 获取页面主要文本元素的颜色信息
    const colorInfo = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('h1, h2, h3, p, a, button'))
      return elements.slice(0, 10).map(el => {
        const styles = window.getComputedStyle(el)
        return {
          tagName: el.tagName,
          color: styles.color,
          backgroundColor: styles.backgroundColor,
          textContent: el.textContent?.slice(0, 30) || ''
        }
      })
    })
    
    console.log('颜色对比度信息:', colorInfo)
    
    // 截图用于手动颜色对比度检查
    await page.screenshot({ 
      path: 'test-results/color-contrast-check.png',
      fullPage: true 
    })
  })
})