# MCP 工具集成使用指南

本指南说明如何在白橙博客项目中使用 MCP (Model Context Protocol) 工具来提升开发效率。

## 目录

- [MCP 工具概览](#mcp-工具概览)
- [Context7 官方文档工具](#context7-官方文档工具)
- [Puppeteer 自动化测试工具](#puppeteer-自动化测试工具)
- [IDE 集成工具](#ide-集成工具)
- [最佳实践](#最佳实践)
- [故障排除](#故障排除)

## MCP 工具概览

本项目集成了以下 MCP 工具：

### 1. Context7 - 官方文档获取
- **功能**: 获取 Next.js、React 等库的最新官方文档
- **用途**: 确保使用最新 API 和最佳实践
- **支持版本**: Next.js 15.3.5+、React 19.1.0+

### 2. Puppeteer - 浏览器自动化
- **功能**: 网页导航、截图、UI 交互测试
- **用途**: E2E 测试、UI 验证、性能测试
- **集成**: 与现有 Playwright 测试框架协同工作

### 3. IDE 工具 - 代码诊断
- **功能**: 实时代码诊断、类型检查
- **用途**: 代码质量保证、错误预防
- **支持**: TypeScript、ESLint 集成

### 4. Sequential Thinking - 复杂问题解决
- **功能**: 结构化分析复杂开发任务
- **用途**: 多步骤规划、决策支持
- **应用**: 架构设计、功能规划

## Context7 官方文档工具

### 基本用法

```bash
# 获取 Next.js 最新文档
mcp context7 resolve-library-id "next.js"
mcp context7 get-library-docs "/vercel/next.js" --topic "app router, performance"

# 获取 React 19 新特性
mcp context7 resolve-library-id "react"
mcp context7 get-library-docs "/context7/react_dev" --topic "react 19, hooks"
```

### 项目中的应用

1. **API 验证**: 在使用新 API 前验证最新文档
2. **最佳实践**: 获取官方推荐的代码模式
3. **版本迁移**: 了解版本间的变化和迁移指南

### 获取的关键信息

#### Next.js 15.3.5+ 特性
- App Router 增强功能
- React 19 支持优化
- 性能改进和缓存策略
- 服务器组件最佳实践

#### React 19.1.0+ 新特性
- 新 Hooks: `useOptimistic`, `useActionState`
- 服务器组件增强
- 性能优化: 并发渲染改进
- 实验性功能: `<Activity>`, `<ViewTransition>`

## Puppeteer 自动化测试工具

### 集成到现有测试框架

项目已创建 `e2e/mcp-puppeteer.spec.ts` 文件，展示如何集成 MCP Puppeteer 工具：

```typescript
// 使用 MCP 工具进行页面截图
await page.screenshot({ 
  path: 'test-results/homepage-screenshot.png',
  fullPage: true 
})

// 响应式设计测试
const viewports = [
  { width: 375, height: 667, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1920, height: 1080, name: 'desktop' }
]
```

### 运行 MCP 测试

```bash
# 运行所有 E2E 测试（包括 MCP 测试）
npm run test:e2e

# 仅运行 MCP Puppeteer 测试
npx playwright test e2e/mcp-puppeteer.spec.ts

# 带 UI 界面运行
npm run test:e2e:ui
```

### MCP 测试功能

1. **页面截图记录**: 自动保存测试过程截图
2. **响应式测试**: 多设备视口测试
3. **表单交互**: 表单填写和验证
4. **性能监控**: 页面加载性能测试
5. **主题切换**: 暗黑模式测试
6. **可访问性**: 键盘导航测试

## IDE 集成工具

### 代码质量检查

使用 MCP IDE 工具进行实时代码诊断：

```bash
# 检查所有文件的诊断信息
mcp ide getDiagnostics

# 检查特定文件
mcp ide getDiagnostics --uri "file:///path/to/file.ts"
```

### 项目质量报告

当前项目质量状态：
- ✅ Next.js 配置文件无错误
- ✅ TypeScript 配置有效
- ⚠️ 发现一些类型错误需要修复
- 📋 测试文件需要类型定义优化

### 修复建议

1. **测试文件类型错误**:
   - 添加适当的 TypeScript 类型定义
   - 修复 React 导入问题
   - 优化 Mock 对象类型

2. **性能监控类型**:
   - 完善 Performance API 类型定义
   - 添加 Web Vitals 类型注解

## 最佳实践

### 1. 官方文档优先原则

```typescript
// ❌ 不推荐：使用过时的 API
import { getServerSideProps } from 'next'

// ✅ 推荐：使用 Next.js 15+ App Router
export default async function Page() {
  const data = await fetch('...', { next: { revalidate: 60 } })
  return <div>...</div>
}
```

### 2. 测试驱动开发

```typescript
// 集成 MCP 工具到测试流程
test('新功能开发', async ({ page }) => {
  // 使用 MCP Puppeteer 工具验证
  await page.goto('/new-feature')
  await page.screenshot({ path: 'feature-test.png' })
  
  // 验证功能正确性
  await expect(page.locator('.feature')).toBeVisible()
})
```

### 3. 持续质量监控

```bash
# 开发前检查
mcp ide getDiagnostics
npm run type-check

# 开发中测试
npm run test:e2e

# 部署前验证
npm run deploy:check
```

### 4. 性能优化指导

根据 Context7 获取的最新文档：

```typescript
// React 19 优化模式
import { useOptimistic, useActionState } from 'react'

function OptimizedComponent() {
  const [optimisticState, setOptimistic] = useOptimistic(state)
  const [actionState, action] = useActionState(serverAction, initialState)
  
  return (
    <form action={action}>
      {/* 优化的 UI */}
    </form>
  )
}
```

### 5. 错误处理最佳实践

```typescript
// 基于官方文档的错误边界
import { ErrorBoundary } from 'react'

export default function Layout({ children }) {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      {children}
    </ErrorBoundary>
  )
}
```

## 工作流程集成

### 日常开发流程

1. **功能开发前**:
   ```bash
   # 获取最新官方文档
   mcp context7 get-library-docs "/vercel/next.js" --topic "new feature"
   
   # 检查代码质量
   mcp ide getDiagnostics
   ```

2. **开发过程中**:
   ```bash
   # 运行开发服务器
   npm run dev
   
   # 实时测试
   npm run test:e2e:ui
   ```

3. **功能完成后**:
   ```bash
   # 完整测试套件
   npm run test:e2e
   
   # 代码质量检查
   npm run lint
   npm run type-check
   ```

### CI/CD 集成

在 GitHub Actions 中集成 MCP 工具：

```yaml
- name: Run MCP Tests
  run: |
    npm run test:e2e
    npx playwright test e2e/mcp-puppeteer.spec.ts
    
- name: Quality Check
  run: |
    npm run type-check
    npm run lint
```

## 故障排除

### 常见问题

1. **依赖冲突**:
   ```bash
   # 使用 legacy-peer-deps 解决
   npm install --legacy-peer-deps
   ```

2. **类型错误**:
   ```bash
   # 检查 TypeScript 配置
   cat tsconfig.json
   
   # 运行类型检查
   npm run type-check
   ```

3. **测试失败**:
   ```bash
   # 查看测试报告
   npm run test:e2e:report
   
   # 调试模式运行
   npm run test:e2e:debug
   ```

### 性能优化

1. **测试性能**:
   - 使用并行测试：`fullyParallel: true`
   - 合理设置重试次数：`retries: 2`
   - 优化测试选择器

2. **构建性能**:
   - 启用 SWC 编译器
   - 使用增量构建
   - 优化 bundle 分析

### 调试技巧

1. **MCP 工具调试**:
   ```bash
   # 详细日志输出
   DEBUG=mcp:* npm run test:e2e
   ```

2. **性能分析**:
   ```bash
   # Bundle 分析
   npm run analyze
   
   # 性能报告
   npx lighthouse http://localhost:3000
   ```

## 总结

MCP 工具的集成为白橙博客项目带来了以下优势：

1. **开发效率提升**: 官方文档实时获取，减少查找时间
2. **质量保证增强**: 自动化测试和代码诊断
3. **技术栈更新**: 及时采用最新最佳实践
4. **团队协作**: 统一的工具和流程

继续关注 MCP 生态的发展，及时更新工具配置，保持项目的技术领先性。

---

**更新日期**: 2024-12-13  
**版本**: 1.0.0  
**维护者**: 白橙开发团队