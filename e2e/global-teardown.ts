/**
 * Playwright 全局清理 - E2E 测试环境清理
 * 在所有测试运行后执行的清理操作
 */

import { FullConfig } from '@playwright/test'
import { promises as fs } from 'fs'
import path from 'path'

async function globalTeardown(config: FullConfig) {
  console.log('🧹 开始 E2E 测试环境清理...')
  
  try {
    // 生成测试报告摘要
    await generateTestSummary()
    
    // 清理临时文件
    await cleanupTempFiles()
    
    // 压缩测试结果
    if (process.env.CI) {
      await compressTestResults()
    }
    
    console.log('✅ E2E 测试环境清理完成')
    
  } catch (error) {
    console.error('❌ E2E 测试环境清理失败:', error)
  }
}

async function generateTestSummary() {
  try {
    const resultsPath = path.join(process.cwd(), 'test-results', 'results.json')
    
    if (await fileExists(resultsPath)) {
      const results = JSON.parse(await fs.readFile(resultsPath, 'utf8'))
      
      const summary = {
        timestamp: new Date().toISOString(),
        duration: results.stats?.duration || 0,
        tests: {
          total: results.stats?.total || 0,
          passed: results.stats?.passed || 0,
          failed: results.stats?.failed || 0,
          skipped: results.stats?.skipped || 0,
        },
        browsers: results.config?.projects?.map(p => p.name) || [],
        performance: await extractPerformanceMetrics(results),
      }
      
      // 保存摘要
      const summaryPath = path.join(process.cwd(), 'test-results', 'summary.json')
      await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2))
      
      // 输出摘要到控制台
      console.log('📊 测试摘要:')
      console.log(`   总测试数: ${summary.tests.total}`)
      console.log(`   通过: ${summary.tests.passed}`)
      console.log(`   失败: ${summary.tests.failed}`)
      console.log(`   跳过: ${summary.tests.skipped}`)
      console.log(`   执行时间: ${(summary.duration / 1000).toFixed(2)}s`)
      
      if (summary.tests.failed > 0) {
        console.log('⚠️  存在失败的测试，请检查详细报告')
      }
    }
  } catch (error) {
    console.warn('无法生成测试摘要:', error.message)
  }
}

async function extractPerformanceMetrics(results: any): Promise<any> {
  const performanceTests = results.suites?.filter(suite => 
    suite.title?.includes('performance') || 
    suite.file?.includes('performance')
  ) || []
  
  if (performanceTests.length === 0) {
    return null
  }
  
  const metrics = {
    avgLoadTime: 0,
    avgLCP: 0,
    avgFID: 0,
    avgCLS: 0,
    testCount: performanceTests.length,
  }
  
  // 这里可以进一步解析性能测试的具体指标
  // 实际实现需要根据测试结果的具体结构来调整
  
  return metrics
}

async function cleanupTempFiles() {
  const tempDirs = [
    path.join(process.cwd(), '.playwright-cache'),
    path.join(process.cwd(), 'test-results', 'temp'),
  ]
  
  for (const dir of tempDirs) {
    try {
      if (await fileExists(dir)) {
        await fs.rmdir(dir, { recursive: true })
        console.log(`🗑️  清理临时目录: ${dir}`)
      }
    } catch (error) {
      console.warn(`无法清理目录 ${dir}:`, error.message)
    }
  }
}

async function compressTestResults() {
  try {
    const resultsDir = path.join(process.cwd(), 'test-results')
    
    if (await fileExists(resultsDir)) {
      // 这里可以添加压缩逻辑，例如创建 tar.gz 文件
      // 为了简化，我们只是记录文件大小
      const stats = await fs.stat(resultsDir)
      console.log(`📦 测试结果目录大小: ${(stats.size / 1024 / 1024).toFixed(2)} MB`)
    }
  } catch (error) {
    console.warn('无法处理测试结果:', error.message)
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

export default globalTeardown