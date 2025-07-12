# 白橙博客

一个基于 Next.js 15.3.5+ 构建的现代博客网站，集成了 MCP 工具，提供卓越的开发体验和性能表现。

## 🎉 **项目状态: 核心功能已完成** ✅

项目当前已实现完整的前端架构和核心组件，包括响应式布局、主题系统、UI组件库等。开发服务器运行正常，用户界面美观且功能完整。

## ✨ 特性

### 🎯 **已实现的核心功能** ✅
- 🚀 **现代框架**: 基于 Next.js 15.3.5+ 和 React 19.1.0+ **已实现**
- 📱 **响应式设计**: 完美适配桌面、平板和移动设备 **已实现**
- 🎨 **优雅 UI**: 使用 Tailwind CSS 构建的现代界面 **已实现**
- 🌙 **主题系统**: 支持深色/浅色/系统自动主题切换 **已实现**
- 🧩 **组件库**: 完整的 UI 组件系统 (Button, Card, Input, Badge) **已实现**
- 🏗️ **布局系统**: Header、Footer、Navigation 组件 **已实现**
- 🔍 **SEO 优化**: 内置 SEO 最佳实践和 metadata **已实现**
- 📐 **TypeScript**: 完整的类型安全保障 **已实现**

### 🔄 **计划中的功能**
- 📝 **Markdown 支持**: 完整的 Markdown 写作体验
- 💬 **评论系统**: 集成 Giscus 评论功能
- 📡 **RSS 订阅**: 自动生成 RSS 订阅源
- 🖼️ **图片优化**: 支持 Cloudflare R2 CDN
- 🔍 **搜索功能**: 全文搜索和筛选

### 🔧 MCP 工具集成
- **Context7**: 实时获取 Next.js、React 官方文档
- **Puppeteer**: 增强的 E2E 测试和 UI 验证
- **IDE 工具**: 实时代码诊断和质量检查
- **Sequential Thinking**: 复杂问题结构化分析

### 🏗️ 企业级特性
- **TypeScript**: 完整的类型安全保障
- **测试覆盖**: Jest 单元测试 + Playwright E2E 测试
- **性能监控**: Core Web Vitals 实时监控
- **安全加固**: CSP、CORS、输入验证
- **部署选项**: Docker、PM2、Vercel、Netlify
- **监控告警**: Prometheus + 多渠道通知

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/yourusername/white-orange-blog.git
cd white-orange-blog
```

### 2. 安装依赖
```bash
npm install --legacy-peer-deps
```

### 3. 环境配置
```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件配置必要参数：
```env
NEXT_PUBLIC_SITE_NAME="白橙博客"
NEXT_PUBLIC_SITE_DESCRIPTION="专注技术分享的个人博客"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
NEXT_PUBLIC_AUTHOR_NAME="您的姓名"
NEXT_PUBLIC_AUTHOR_EMAIL="your@email.com"
NEXT_OUTPUT_MODE="standalone"
```

### 4. 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

**🎉 恭喜！现在您可以看到完整的博客网站界面，包括：**
- ✅ 响应式导航头部（支持主题切换）
- ✅ 精美的首页 Hero 区域
- ✅ 精选文章展示区域
- ✅ 最新文章列表
- ✅ 个人介绍和技能展示
- ✅ 完整的网站底部

## 📋 开发命令

### 基础命令
```bash
# 开发
npm run dev                 # 启动开发服务器

# 构建
npm run build              # 构建生产版本
npm run build:static       # 构建静态站点 (Vercel/Netlify)
npm run build:server       # 构建服务器模式 (自托管)

# 代码质量
npm run lint               # ESLint 检查
npm run lint:fix           # 修复 ESLint 问题
npm run type-check         # TypeScript 类型检查
npm run format             # Prettier 代码格式化
```

### 测试命令
```bash
# 单元测试
npm run test               # 运行单元测试
npm run test:watch         # 监听模式运行测试
npm run test:coverage      # 生成覆盖率报告

# E2E 测试
npm run test:e2e           # 运行所有 E2E 测试
npm run test:e2e:ui        # 带 UI 界面的 E2E 测试
npm run test:e2e:debug     # 调试模式 E2E 测试

# MCP 增强测试
npm run test:e2e -- e2e/mcp-puppeteer.spec.ts  # MCP Puppeteer 测试
npx playwright test --ui e2e/mcp-puppeteer.spec.ts  # MCP 测试 UI 模式
```

### 部署命令
```bash
# 预部署检查
npm run deploy:check       # 全面的部署前检查

# 部署选项
npm run deploy:docker      # Docker 部署
npm run deploy:pm2         # PM2 部署
npm run deploy:static      # 静态部署

# 健康检查
npm run health:check       # 应用健康检查
npm run rollback           # 紧急回滚
```

## 🧪 MCP 工具使用

### Context7 - 官方文档集成
获取最新的官方文档和 API 信息：
```bash
# 获取 Next.js 最新文档
mcp context7 resolve-library-id "next.js"
mcp context7 get-library-docs "/vercel/next.js" --topic "app router"

# 获取 React 19 新特性
mcp context7 get-library-docs "/context7/react_dev" --topic "react 19, hooks"
```

### Puppeteer - E2E 测试增强
运行 MCP 集成的 E2E 测试：
```bash
# 运行 MCP Puppeteer 测试
npm run test:e2e -- e2e/mcp-puppeteer.spec.ts

# 带 UI 界面运行
npx playwright test --ui e2e/mcp-puppeteer.spec.ts
```

### IDE 工具 - 代码质量检查
实时代码诊断和质量检查：
```bash
# 检查所有文件诊断
mcp ide getDiagnostics

# 运行完整质量检查
npm run type-check && npm run lint
```

## 📁 项目结构

```
├── app/                    # Next.js App Router
├── components/             # React 组件
├── lib/                    # 工具函数和库
├── content/                # 博客内容 (Markdown)
├── public/                 # 静态资源
├── e2e/                    # E2E 测试
│   ├── mcp-puppeteer.spec.ts # MCP Puppeteer 集成测试
│   └── example.spec.ts     # 常规 E2E 测试
├── docs/                   # 文档
│   └── mcp-tools-guide.md  # MCP 工具使用指南
├── scripts/                # 部署和维护脚本
├── monitoring/             # 监控配置
├── nginx/                  # Nginx 配置
└── docker-compose.yml      # Docker 部署配置
```

## 📝 内容管理

### 文章结构
```
content/
├── tech/                   # 技术文章
│   ├── frontend/           # 前端技术
│   ├── backend/            # 后端技术
│   └── devtools/           # 开发工具
├── life/                   # 生活文章
│   ├── thoughts/           # 思考感悟
│   ├── travel/             # 旅行见闻
│   └── books/              # 读书笔记
└── projects/               # 项目展示
    ├── open-source/        # 开源项目
    └── personal/           # 个人项目
```

### 文章格式
```markdown
---
title: "文章标题"
description: "文章描述，用于 SEO"
date: "2024-01-15"
categories: ["tech", "frontend"]
tags: ["React", "Next.js"]
author: "作者名称"
draft: false
featured: true
cover: "https://cdn.example.com/image.jpg"
---

# 文章内容

您的文章内容...
```

## 🏗️ 项目架构

### 当前实现状态

#### ✅ **已完成的组件**

**核心框架**
- `app/layout.tsx` - 根布局，SEO优化，主题集成
- `app/page.tsx` - 首页组件组合
- `app/globals.css` - 完整设计系统和动画

**UI 组件库** (`components/ui/`)
- `Button.tsx` - 多变体按钮组件（6种变体，4种尺寸）
- `Input.tsx` - 表单输入组件
- `Card.tsx` - 卡片布局组件套件
- `Badge.tsx` - 标签组件

**布局组件** (`components/layout/`)
- `Header.tsx` - 响应式导航头部（主题切换、搜索、菜单）
- `Footer.tsx` - 网站底部（链接、社交媒体、版权）

**首页组件** (`components/home/`)
- `Hero.tsx` - 首页横幅（动画背景、CTA按钮）
- `FeaturedPosts.tsx` - 精选文章展示
- `RecentPosts.tsx` - 最新文章列表
- `About.tsx` - 个人介绍和技能展示

**系统组件**
- `ThemeProvider.tsx` - 主题管理（深色/浅色/系统）
- `lib/utils.ts` - 工具函数集合

#### 🔄 **下一阶段开发计划**

1. **博客内容系统** - Markdown 处理和文章管理
2. **搜索功能** - 全文搜索和筛选
3. **分页系统** - 文章列表分页
4. **API 路由** - Sitemap、RSS、搜索接口

### 技术栈详情

- **前端框架**: Next.js 15.3.5+ (App Router)
- **UI 库**: React 19.1.0+ 
- **样式系统**: Tailwind CSS + CSS Variables
- **组件方案**: class-variance-authority (CVA)
- **主题管理**: next-themes
- **图标库**: Lucide React
- **类型检查**: TypeScript 5.7.2+ (严格模式)
- **开发工具**: ESLint + Prettier + Husky

## 🚢 部署选项

### 1. 自托管部署（推荐）
```bash
# Docker 部署
npm run deploy:docker

# PM2 部署
npm run deploy:pm2

# 静态文件部署
npm run deploy:static
```

### 2. 云平台部署
- **Vercel**: 原生 Next.js 支持，零配置部署
- **Netlify**: 静态站点部署，全球 CDN
- **Cloudflare Pages**: 高性能全球分发

### 3. SSL 证书配置
```bash
# 自动配置 SSL 证书（自托管）
sudo ./scripts/ssl-setup.sh yourdomain.com
```

## 📊 性能监控

### Core Web Vitals 监控
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### 监控工具
- **Prometheus**: 指标收集和告警
- **自定义仪表板**: 实时性能监控
- **多渠道告警**: Slack、Discord、邮件、短信

### 健康检查
```bash
# 应用健康检查
./scripts/health-check.sh [URL]

# 性能分析
npm run analyze
```

## 🔒 安全特性

### 安全措施
- **CSP**: 内容安全策略
- **HSTS**: HTTP 严格传输安全
- **输入验证**: Zod 模式验证
- **XSS 防护**: DOMPurify 内容净化
- **依赖扫描**: 自动漏洞检测

### 安全检查
```bash
# 安全审计
npm run security:audit

# 修复安全问题
npm run security:fix
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发规范
- 使用 ESLint 和 Prettier 保证代码质量
- 编写单元测试和 E2E 测试
- 遵循 TypeScript 严格模式
- 使用 MCP 工具验证 API 使用正确性

## 📖 文档

- [MCP 工具使用指南](docs/mcp-tools-guide.md)
- [开发工作流程](docs/development-workflow.md)
- [部署指南](deployment-guide.md)
- [故障排除](docs/troubleshooting.md)

## 🛠️ 技术栈

- **框架**: Next.js 15.3.5+, React 19.1.0+
- **语言**: TypeScript 5.7.2+
- **样式**: Tailwind CSS
- **测试**: Jest, Playwright, MCP Puppeteer
- **部署**: Docker, PM2, Nginx
- **监控**: Prometheus, Core Web Vitals
- **MCP 工具**: Context7, IDE 集成, Sequential Thinking

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Playwright](https://playwright.dev/) - E2E 测试
- [MCP](https://modelcontextprotocol.io/) - 模型上下文协议

---

**如果这个项目对您有帮助，请给个 ⭐️ 支持一下！**