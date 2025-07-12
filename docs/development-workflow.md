# 开发和部署流程文档

白橙博客系统 - Next.js 15.3.5+ & React 19.1.0+ 完整开发工作流

## 项目概述

本文档提供完整的开发、测试、构建和部署工作流程，适用于白橙博客系统的所有环境和场景。

## 开发环境设置

### 系统要求

- **Node.js**: >=22.17.0
- **npm**: >=10.9.2
- **TypeScript**: ^5.7.2
- **操作系统**: Linux (推荐 Ubuntu 20.04+), macOS, Windows

### 初始化项目

```bash
# 克隆项目
git clone <repository-url>
cd white_orange

# 安装依赖
npm install

# 复制环境配置
cp .env.local.example .env.local

# 编辑环境变量
nano .env.local

# 启动开发服务器
npm run dev
```

### 环境变量配置

创建 `.env.local` 文件并配置以下必需变量：

```bash
# 网站基本信息
NEXT_PUBLIC_SITE_NAME="白橙博客"
NEXT_PUBLIC_SITE_DESCRIPTION="技术分享与生活记录"
NEXT_PUBLIC_SITE_URL="https://whiteorange.dev"
NEXT_PUBLIC_AUTHOR_NAME="白橙"
NEXT_PUBLIC_AUTHOR_EMAIL="contact@whiteorange.dev"

# 部署模式 (export 用于静态部署，standalone 用于服务器部署)
NEXT_OUTPUT_MODE="standalone"

# 图片存储配置 (可选)
NEXT_PUBLIC_IMAGE_HOST="https://cdn.whiteorange.dev"
CLOUDFLARE_R2_ACCESS_KEY="your-access-key"
CLOUDFLARE_R2_SECRET_KEY="your-secret-key"
CLOUDFLARE_R2_BUCKET="your-bucket"

# 监控配置 (可选)
WEBHOOK_PORT=9999
WEBHOOK_SECRET="your-webhook-secret"
EMAIL_ALERTS_ENABLED=true
SLACK_ALERTS_ENABLED=false
```

## 开发工作流

### 1. 代码开发 (集成 MCP 工具)

```bash
# 启动开发服务器
npm run dev

# 在另一个终端中监控类型检查
npm run type-check -- --watch

# MCP 工具：获取最新官方文档
mcp context7 resolve-library-id "next.js"
mcp context7 get-library-docs "/vercel/next.js" --topic "app router, performance"

# MCP 工具：实时代码质量检查
mcp ide getDiagnostics

# 格式化代码
npm run format

# 修复 ESLint 问题
npm run lint:fix
```

#### MCP 工具在开发中的应用

**Context7 - 官方文档集成**：
- 开发新功能前：获取最新官方 API 文档
- 验证代码模式：确保使用官方推荐实践
- 版本迁移：获取升级指南和变更说明

**IDE 工具 - 质量保证**：
- 实时诊断：`mcp ide getDiagnostics`
- 类型检查：集成 TypeScript 严格模式
- 错误预防：开发时即时发现问题

**Sequential Thinking - 复杂问题解决**：
- 架构设计：结构化分析设计决策
- 功能规划：多步骤任务分解
- 技术选型：权衡不同方案优劣

### 2. 内容管理

```bash
# 内容结构
content/
├── tech/           # 技术文章
│   ├── frontend/
│   ├── backend/
│   └── devtools/
├── life/           # 生活文章
│   ├── thoughts/
│   ├── travel/
│   └── books/
├── projects/       # 项目展示
└── about.md        # 关于页面
```

**文章模板**：

```markdown
---
title: "文章标题"
description: "SEO 描述"
date: "2024-01-15"
categories: ["tech", "frontend"]
tags: ["React", "Next.js"]
author: "白橙"
draft: false
featured: true
cover: "https://cdn.example.com/image.jpg"
---

# 文章内容

在此处编写您的文章内容...
```

### 3. 质量保证 (集成 MCP 测试)

```bash
# 运行所有测试
npm run test

# 运行覆盖率测试
npm run test:coverage

# 运行 E2E 测试
npm run test:e2e

# MCP 工具：运行 Puppeteer 增强测试
npm run test:e2e -- e2e/mcp-puppeteer.spec.ts

# 运行带 UI 的 E2E 测试
npm run test:e2e:ui

# MCP 工具：带 UI 的 Puppeteer 测试
npx playwright test --ui e2e/mcp-puppeteer.spec.ts

# MCP 工具：IDE 代码质量检查
mcp ide getDiagnostics

# 类型检查
npm run type-check

# 代码规范检查
npm run lint

# 安全检查
npm run security:audit
```

#### MCP 增强测试功能

**Puppeteer E2E 测试** (`e2e/mcp-puppeteer.spec.ts`)：
- **页面截图记录**：自动保存测试过程截图
- **响应式设计测试**：多设备视口验证
- **表单交互测试**：表单填写和验证
- **性能监控测试**：页面加载性能验证
- **主题切换测试**：暗黑模式功能验证
- **可访问性测试**：键盘导航和屏幕阅读器支持

### 4. 预部署检查 (集成 MCP 验证)

```bash
# MCP 工具：验证 API 兼容性
mcp context7 get-library-docs "/vercel/next.js" --topic "latest changes, breaking changes"

# MCP 工具：最终代码质量检查
mcp ide getDiagnostics

# MCP 工具：运行增强 E2E 测试
npm run test:e2e -- e2e/mcp-puppeteer.spec.ts

# 运行完整的预部署检查
npm run deploy:check

# 这将执行：
# - 版本要求检查 (Node.js ≥22.17.0, React ≥19.1.0, Next.js ≥15.3.5)
# - 依赖漏洞扫描
# - 构建测试
# - 类型检查
# - 单元测试
# - E2E 测试 (包括 MCP 增强测试)
# - 性能验证 (Core Web Vitals)
# - MCP 工具验证
```

#### MCP 工具在预部署中的作用

1. **API 兼容性验证**：确保使用的 API 在最新版本中仍然有效
2. **代码质量最终检查**：通过 IDE 工具检测潜在问题
3. **UI 功能完整性**：通过 Puppeteer 测试验证用户界面
4. **性能标准验证**：确保 Core Web Vitals 达标

## 构建流程

### 开发构建

```bash
# 普通构建 (根据 NEXT_OUTPUT_MODE 环境变量)
npm run build

# 开发模式启动
npm run dev
```

### 生产构建

#### 静态网站构建 (Vercel/Netlify)

```bash
# 设置环境变量
export NEXT_OUTPUT_MODE=export

# 构建静态网站
npm run build:static

# 输出在 out/ 目录
```

#### 服务器构建 (自托管)

```bash
# 设置环境变量
export NEXT_OUTPUT_MODE=standalone

# 构建服务器应用
npm run build:server

# 启动生产服务器
npm run start
```

#### 构建分析

```bash
# 分析构建包大小
npm run analyze

# 生成站点地图
npm run postbuild
```

## 测试策略

### 单元测试

```bash
# 运行所有单元测试
npm run test

# 监控模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

**测试覆盖率要求**：
- 分支覆盖率: ≥80%
- 函数覆盖率: ≥80%
- 行覆盖率: ≥80%
- 语句覆盖率: ≥80%

### E2E 测试 (包含 MCP 增强测试)

```bash
# 运行所有 E2E 测试
npm run test:e2e

# 运行 MCP Puppeteer 增强测试
npm run test:e2e -- e2e/mcp-puppeteer.spec.ts

# 带界面的 E2E 测试
npm run test:e2e:ui

# 带界面的 MCP 测试
npx playwright test --ui e2e/mcp-puppeteer.spec.ts

# 调试模式
npm run test:e2e:debug

# 查看测试报告
npm run test:e2e:report
```

**常规测试覆盖范围**：
- 页面加载和导航
- 响应式设计 (桌面、平板、手机)
- 搜索功能
- SEO 元数据
- 性能指标
- 可访问性检查

**MCP 增强测试覆盖范围**：
- **截图记录测试**：每个测试步骤自动截图
- **多设备响应式测试**：Mobile (375x667)、Tablet (768x1024)、Desktop (1920x1080)
- **表单交互测试**：表单填写、验证、提交流程
- **性能监控测试**：TTFB、Load Time、DOM Parse Time 测试
- **主题切换测试**：明暗主题切换功能验证
- **错误页面测试**：404 页面功能验证
- **键盘导航测试**：无障碍访问支持验证
- **颜色对比度测试**：可访问性颜色检查

## 部署方案

### 1. 静态部署 (Vercel/Netlify)

```bash
# 构建静态文件
npm run build:static

# 部署到 Vercel
npm run deploy:static

# 或手动上传 out/ 目录到托管平台
```

**Vercel 配置** (vercel.json):
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "out"
      }
    }
  ]
}
```

### 2. Docker 部署

```bash
# 构建 Docker 镜像
npm run docker:build

# 使用 Docker Compose 部署
npm run deploy:docker

# 检查容器状态
npm run docker:logs
```

**Docker 配置特点**：
- 多阶段构建优化镜像大小
- 非 root 用户运行提高安全性
- 健康检查确保服务可用性
- 环境变量配置支持

### 3. PM2 部署

```bash
# 构建应用
npm run build:server

# 使用 PM2 部署
npm run deploy:pm2

# 管理 PM2 进程
npm run pm2:status
npm run pm2:logs
npm run pm2:restart
```

**PM2 配置特点**：
- 集群模式提高性能
- 自动重启机制
- 日志管理
- 性能监控

### 4. 传统服务器部署

```bash
# 准备部署环境
sudo ./scripts/ssl-setup.sh yourdomain.com

# 部署应用
npm run build:server
sudo systemctl start blog
```

## 监控和维护

### 系统监控

```bash
# 启动监控服务
npm run monitoring:start

# 测试监控端点
npm run monitoring:test

# 查看健康状态
npm run health:check
```

**监控功能**：
- 应用程序健康检查
- 性能指标收集 (Core Web Vitals)
- 错误追踪和报告
- 资源使用监控
- SSL 证书到期检查

### 日志管理

**日志类型和位置**：
```bash
/var/log/blog/
├── app.log          # 应用程序日志
├── error.log        # 错误日志
├── access.log       # 访问日志
├── performance.log  # 性能日志
├── security.log     # 安全日志
└── monitoring/      # 监控日志目录
```

**日志轮转配置**：
- 应用日志：每日轮转，保留 30 天
- 错误日志：每日轮转，保留 90 天
- 性能日志：每日轮转，保留 30 天
- 安全日志：每日轮转，保留 365 天

### 备份和恢复

```bash
# 创建备份
./scripts/backup.sh

# 列出可用备份
npm run rollback:list

# 回滚到上一版本
npm run rollback

# 回滚到特定版本
npm run rollback -- --version v1.2.3
```

## 安全配置

### 内容安全策略 (CSP)

配置在 `lib/security-config.ts` 中：
- 严格的脚本源控制
- 图片和样式源限制
- 框架和对象嵌入防护
- 升级不安全请求

### 输入验证和清理

- 使用 Zod 进行环境变量验证
- DOMPurify 清理用户输入
- Markdown 内容安全处理
- API 路由输入验证

### 依赖安全

```bash
# 安全审计
npm run security:audit

# 修复已知漏洞
npm run security:fix

# 完整安全检查
npm run security:check
```

## 性能优化

### 构建优化

- Tree shaking 去除未使用代码
- 代码分割减少初始加载
- 图片优化和懒加载
- 静态资源压缩

### 运行时优化

- Next.js Image 组件优化
- 服务端渲染 (SSR)
- 静态生成 (SSG)
- API 路由缓存

### 性能监控

- Core Web Vitals 跟踪
- 慢查询检测
- 内存使用监控
- GC 压力分析

## 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 检查 Node.js 版本
   node --version
   
   # 清理并重新安装依赖
   rm -rf node_modules package-lock.json
   npm install
   
   # 清理构建缓存
   npm run clean
   ```

2. **类型错误**
   ```bash
   # 运行类型检查
   npm run type-check
   
   # 检查 TypeScript 配置
   cat tsconfig.json
   ```

3. **测试失败**
   ```bash
   # 运行特定测试
   npm run test -- --testNamePattern="test-name"
   
   # 调试测试
   npm run test:watch
   ```

4. **部署问题**
   ```bash
   # 运行部署前检查
   npm run deploy:check
   
   # 检查服务状态
   npm run health:check
   
   # 查看日志
   npm run pm2:logs
   ```

### 调试工具

- **开发工具**: Chrome DevTools, React DevTools
- **性能分析**: Lighthouse, WebPageTest
- **错误追踪**: 控制台日志, 错误边界
- **网络分析**: Network 面板, 缓存分析

## 团队协作

### Git 工作流

```bash
# 功能分支开发
git checkout -b feature/new-feature
git commit -m "feat: add new feature"
git push origin feature/new-feature

# 代码审查后合并
git checkout main
git merge feature/new-feature
git push origin main
```

### 代码质量

- **Husky**: Git hooks 自动化
- **lint-staged**: 提交前代码检查
- **Prettier**: 代码格式化
- **ESLint**: 代码规范检查

### 版本发布

```bash
# 更新版本号
npm version patch  # 或 minor, major

# 创建发布标签
git tag -a v1.0.1 -m "Release version 1.0.1"
git push origin v1.0.1

# 部署到生产环境
npm run deploy:docker
```

## 生产环境最佳实践

### 环境配置

1. **环境变量管理**
   - 生产环境密钥单独管理
   - 使用环境变量而非硬编码
   - 定期轮换敏感信息

2. **SSL/TLS 配置**
   - 使用 HTTPS 强制跳转
   - 配置 HSTS 头部
   - 定期更新 SSL 证书

3. **服务器配置**
   - 启用 Gzip/Brotli 压缩
   - 配置适当的缓存策略
   - 设置安全响应头

### 监控告警

1. **应用程序监控**
   - 响应时间阈值告警
   - 错误率超限告警
   - 内存使用告警

2. **基础设施监控**
   - CPU/内存使用率
   - 磁盘空间使用
   - 网络连接状态

3. **业务指标监控**
   - 页面访问量
   - 用户行为分析
   - 转化率跟踪

---

这个完整的开发和部署流程文档确保了项目从开发到生产的每个环节都有明确的指导和最佳实践。