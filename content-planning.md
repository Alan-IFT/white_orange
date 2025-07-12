# 博客内容规划

## 网站基本信息

**重要说明**：以下信息仅为示例，实际配置通过环境变量进行设置。

```json
{
  "title": "个人博客",
  "description": "分享技术见解与生活感悟的个人博客",
  "author": {
    "name": "博主名称",
    "bio": "全栈开发者，热爱技术与生活",
    "email": "contact@yourdomain.com",
    "location": "中国"
  },
  "url": "https://yourdomain.com",
  "language": "zh-CN",
  "timezone": "Asia/Shanghai"
}
```

**配置方式**：
1. 复制 `.env.local.example` 文件为 `.env.local`
2. 填写你的实际网站信息：
   - `NEXT_PUBLIC_SITE_NAME`: 网站名称
   - `NEXT_PUBLIC_SITE_DESCRIPTION`: 网站描述
   - `NEXT_PUBLIC_SITE_URL`: 网站域名
   - `NEXT_PUBLIC_AUTHOR_NAME`: 作者名称
   - `NEXT_PUBLIC_AUTHOR_EMAIL`: 作者邮箱
   - `NEXT_OUTPUT_MODE`: 部署模式（`standalone` 或 `export`）
   - 其他配置项参考环境变量模板

**部署模式说明**：
- `NEXT_OUTPUT_MODE=standalone`：服务器模式，适用于自建服务器
- `NEXT_OUTPUT_MODE=export`：静态导出模式，适用于 Vercel、Netlify 等平台

## 博客分类结构

```
content/
├── tech/                    # 技术分类
│   ├── frontend/           # 前端技术
│   │   ├── react-best-practices.md
│   │   ├── css-modern-techniques.md
│   │   └── javascript-performance.md
│   ├── backend/            # 后端技术
│   │   ├── node-microservices.md
│   │   ├── database-optimization.md
│   │   └── api-design-patterns.md
│   ├── devtools/           # 开发工具
│   │   ├── git-workflow.md
│   │   ├── docker-practices.md
│   │   └── vscode-extensions.md
│   └── architecture/       # 系统架构
│       ├── microservices-design.md
│       ├── cloud-deployment.md
│       └── performance-optimization.md
├── life/                   # 生活分类
│   ├── thoughts/           # 思考感悟
│   │   ├── work-life-balance.md
│   │   ├── continuous-learning.md
│   │   └── career-growth.md
│   ├── travel/             # 旅行见闻
│   │   ├── japan-tech-tour.md
│   │   ├── silicon-valley-experience.md
│   │   └── remote-work-journey.md
│   └── books/              # 读书笔记
│       ├── clean-code-notes.md
│       ├── system-design-review.md
│       └── philosophy-thinking.md
├── projects/               # 项目展示
│   ├── open-source/        # 开源项目
│   │   ├── blog-generator.md
│   │   ├── dev-tools-collection.md
│   │   └── learning-resources.md
│   └── personal/           # 个人项目
│       ├── side-project-1.md
│       ├── side-project-2.md
│       └── experiments.md
└── about.md                # 关于页面
```

## 初始文章示例

### 1. 技术文章示例

**文件路径**: `content/tech/frontend/react-best-practices.md`

```markdown
---
title: "React 最佳实践：构建可维护的前端应用"
description: "分享在 React 开发中积累的最佳实践，包括组件设计、状态管理、性能优化等方面的经验"
date: "2024-01-15"
categories: ["tech", "frontend"]
tags: ["React", "JavaScript", "前端开发", "最佳实践"]
author: "白橙"
draft: false
featured: true
cover: "https://r2.whiteorange.dev/images/react-best-practices.jpg"
seo:
  keywords: ["React", "前端开发", "最佳实践", "JavaScript", "组件设计"]
---

# React 最佳实践：构建可维护的前端应用

在过去几年的 React 开发经验中，我总结了一些有助于构建可维护、高性能前端应用的最佳实践。

## 组件设计原则

### 1. 单一职责原则
每个组件应该只负责一个功能，这样可以提高代码的可读性和可维护性。

### 2. 合理的组件拆分
将复杂的组件拆分成多个小组件，每个组件都有明确的职责。

## 状态管理策略

### 1. 选择合适的状态管理工具
- 简单应用：使用 React 内置的 useState 和 useContext
- 复杂应用：考虑使用 Redux、Zustand 或 Jotai

### 2. 状态提升和下沉
合理地管理状态的层级，避免过度提升或下沉。

## 性能优化技巧

### 1. 使用 React.memo 和 useMemo
在适当的场景下使用这些优化工具，避免不必要的重渲染。

### 2. 代码分割和懒加载
使用 React.lazy 和 Suspense 实现路由级别的代码分割。

## 总结

遵循这些最佳实践可以帮助你构建更加健壮、可维护的 React 应用。记住，最佳实践不是死板的规则，而是指导原则，需要根据具体情况灵活应用。
```

### 2. 生活文章示例

**文件路径**: `content/life/thoughts/work-life-balance.md`

```markdown
---
title: "远程工作两年后的思考：如何平衡工作与生活"
description: "分享两年远程工作经验中关于工作生活平衡的思考和实践"
date: "2024-01-10"
categories: ["life", "thoughts"]
tags: ["远程工作", "工作生活平衡", "个人成长"]
author: "白橙"
draft: false
featured: false
cover: "https://r2.whiteorange.dev/images/work-life-balance.jpg"
---

# 远程工作两年后的思考：如何平衡工作与生活

两年前，我开始了全职远程工作的生活。这段经历让我对工作与生活的平衡有了新的认识。

## 远程工作的挑战

### 1. 边界模糊
在家工作最大的挑战是工作和生活边界的模糊。没有了通勤的物理分割，很容易陷入"永远在工作"的状态。

### 2. 社交缺失
缺少面对面的交流，有时会感到孤独和与团队的疏离。

## 我的解决方案

### 1. 建立仪式感
- 每天早上"通勤"到书房，换上工作服装
- 设定固定的工作时间，严格遵守
- 工作结束后有明确的"下班"仪式

### 2. 主动社交
- 定期与同事视频通话，不仅限于工作内容
- 参加线上技术社区活动
- 保持与朋友的联系

## 收获与成长

远程工作让我学会了更好的时间管理和自我约束。虽然有挑战，但整体来说这是一次宝贵的经历。

重要的是找到适合自己的平衡点，而不是追求完美的平衡。
```

### 3. 项目展示示例

**文件路径**: `content/projects/open-source/blog-generator.md`

```markdown
---
title: "个人博客生成器：从零到一的开发历程"
description: "分享开发个人博客生成器的完整历程，包括技术选型、架构设计和优化过程"
date: "2024-01-05"
categories: ["projects", "open-source"]
tags: ["博客", "静态站点生成器", "Next.js", "开源项目"]
author: "白橙"
draft: false
featured: true
cover: "https://r2.whiteorange.dev/images/blog-generator.jpg"
repo: "https://github.com/whiteorange/blog-generator"
demo: "https://blog-demo.whiteorange.dev"
---

# 个人博客生成器：从零到一的开发历程

## 项目背景

作为一名开发者，我一直想要一个简单、高效的博客系统。市面上的解决方案要么过于复杂，要么不够灵活。于是我决定自己开发一个。

## 技术选型

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **内容管理**: Markdown + Gray Matter
- **部署**: Vercel
- **图片存储**: Cloudflare R2

## 核心功能

### 1. Markdown 支持
- 支持标准 Markdown 语法
- 代码高亮
- 数学公式渲染
- 图片懒加载

### 2. SEO 优化
- 自动生成 sitemap
- 结构化数据
- Open Graph 支持
- 性能优化

### 3. 用户体验
- 响应式设计
- 暗黑模式
- 搜索功能
- 文章目录

## 开发过程

### 阶段一：基础架构
首先搭建了基本的文件结构和 Markdown 解析功能。

### 阶段二：样式优化
使用 Tailwind CSS 设计了简洁的界面。

### 阶段三：功能增强
添加了搜索、标签、分类等功能。

### 阶段四：性能优化
进行了大量的性能优化，包括图片优化、代码分割等。

## 项目亮点

1. **极简设计**: 专注于内容，去除不必要的干扰
2. **高性能**: 静态生成，加载速度快
3. **SEO 友好**: 完善的 SEO 优化
4. **易于定制**: 模块化设计，易于扩展

## 部署和使用

项目已开源，可以通过以下方式使用：

```bash
git clone https://github.com/whiteorange/blog-generator
cd blog-generator
npm install
npm run dev
```

## 未来计划

- 添加评论系统
- 支持多语言
- 优化移动端体验
- 添加更多主题

## 总结

这个项目让我对静态站点生成器有了更深入的理解，也提高了我的全栈开发能力。希望这个项目能够帮助到其他有类似需求的开发者。
```

## 内容更新计划

### 短期目标（1-3个月）
- 每周发布2-3篇技术文章
- 每月发布1-2篇生活感悟
- 完成项目展示页面

### 长期目标（3-12个月）
- 建立稳定的更新频率
- 增加视频内容
- 开始写作系列教程
- 与其他博主建立合作关系

## 内容质量标准

1. **技术文章**：必须有实际代码示例和可操作的步骤
2. **生活文章**：真实、有价值的思考和感悟
3. **项目展示**：完整的项目介绍和技术细节
4. **SEO优化**：每篇文章都要有完整的 meta 信息

## 读者画像

- **主要读者**：前端/全栈开发者
- **次要读者**：对技术感兴趣的学生和爱好者
- **内容定位**：实用性和思考性并重

## 部署和运维建议

### 自建服务器运维
1. **内容备份**：定期备份 `content/` 目录
2. **系统更新**：保持服务器系统和依赖更新
3. **SSL 证书**：设置自动续期避免过期
4. **监控告警**：配置服务器状态监控
5. **性能优化**：定期检查网站性能指标

### 云平台托管
1. **环境变量管理**：在平台控制面板配置环境变量
2. **域名配置**：配置自定义域名和 DNS
3. **构建优化**：优化构建时间和资源使用
4. **分析监控**：启用平台提供的分析工具

### 内容管理工作流
1. **本地编辑**：使用 Markdown 编辑器创建内容
2. **预览检查**：本地启动开发服务器预览
3. **版本控制**：提交到 Git 仓库
4. **自动部署**：推送触发自动构建和部署