---
title: "个人效率工具分享：2024 年我的开发工具链"
description: "分享我在日常开发中使用的效率工具和配置，包括代码编辑器、终端工具、效率软件等。"
date: "2024-01-01"
categories: ["生活分享"]
tags: ["工具", "效率", "生活", "开发环境"]
author: "白橙"
draft: false
featured: false
---

# 个人效率工具分享：2024 年我的开发工具链

作为一名全栈开发者，选择合适的工具对提高开发效率至关重要。经过多年的实践和调优，我总结出了一套适合自己的工具链。今天就来分享给大家。

## 💻 代码编辑器

### Visual Studio Code

**主力编辑器**，几乎可以应对所有开发需求。

#### 必备插件：

- **ES7+ React/Redux/React-Native snippets** - React 开发神器
- **Prettier** - 代码格式化
- **ESLint** - 代码质量检查
- **Auto Rename Tag** - HTML/JSX 标签同步重命名
- **Bracket Pair Colorizer** - 括号配对着色
- **GitLens** - Git 增强工具
- **Thunder Client** - API 测试工具

#### 个人配置：

```json
{
  "editor.fontSize": 14,
  "editor.fontFamily": "'Fira Code', 'Consolas', monospace",
  "editor.fontLigatures": true,
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "editor.minimap.enabled": false,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "workbench.colorTheme": "One Dark Pro",
  "workbench.iconTheme": "material-icon-theme"
}
```

### JetBrains WebStorm

**备用编辑器**，用于复杂项目的重构和调试。

- 强大的重构功能
- 智能代码补全
- 内置调试器
- 集成的版本控制

## 🖥️ 终端工具

### iTerm2 (macOS) / Windows Terminal

**现代化终端模拟器**，支持分屏、标签页和丰富的自定义配置。

#### 配置亮点：

- **分屏功能**：同时查看多个窗口
- **热键切换**：快速在不同项目间切换
- **自动完成**：文件路径和命令自动补全

### Oh My Zsh

**Zsh 配置框架**，让终端变得更加好用。

#### 推荐插件：

```bash
plugins=(
  git
  zsh-autosuggestions
  zsh-syntax-highlighting
  autojump
  docker
  npm
  node
)
```

#### 推荐主题：

- **powerlevel10k** - 高度可定制的主题
- **agnoster** - 简洁美观的主题

## ⚙️ 开发工具

### Git 相关

#### SourceTree
**可视化 Git 客户端**，特别适合处理复杂的分支操作。

#### GitHub Desktop
**简单易用**，适合日常的 Git 操作。

### 数据库工具

#### TablePlus
**现代化数据库客户端**，支持多种数据库。

- 美观的界面设计
- 强大的查询编辑器
- 多数据库支持

#### Redis Desktop Manager
**Redis 管理工具**，用于缓存管理和调试。

## 📦 包管理器

### Node.js 生态

#### nvm (Node Version Manager)
**Node.js 版本管理器**，轻松在不同版本间切换。

```bash
# 安装最新 LTS 版本
nvm install --lts

# 切换到特定版本
nvm use 18.17.0

# 查看已安装版本
nvm list
```

#### pnpm
**更快的包管理器**，节省磁盘空间和安装时间。

```bash
# 全局安装
npm install -g pnpm

# 使用 pnpm 替代 npm
pnpm install
pnpm run dev
```

## 🎨 设计工具

### Figma
**在线协作设计工具**，用于 UI/UX 设计和原型制作。

- 实时协作
- 丰富的组件库
- 强大的插件生态

### Sketch (macOS)
**矢量设计工具**，用于制作精美的 UI 设计。

## 📝 文档工具

### Notion
**全能笔记工具**，用于项目管理和知识库构建。

#### 使用场景：
- 项目进度跟踪
- 技术文档编写
- 代码片段收藏
- 学习笔记整理

### Obsidian
**双链笔记工具**，用于构建个人知识网络。

- Markdown 原生支持
- 可视化关系图
- 丰富的插件系统

## 🚀 效率提升工具

### Alfred (macOS) / PowerToys (Windows)
**系统效率提升工具**，快速启动应用和执行操作。

#### Alfred 常用功能：
- 应用快速启动
- 文件搜索
- 计算器
- 剧本执行

### Rectangle (macOS) / FancyZones (Windows)
**窗口管理工具**，高效组织桌面空间。

### CleanMyMac
**系统清理工具**，保持 Mac 的最佳性能。

## 📡 网络工具

### Proxyman / Charles
**HTTP 代理工具**，用于 API 调试和网络分析。

- 请求/响应拦截
- 网络性能分析
- Mock 数据返回

### Postman
**API 开发平台**，用于 API 测试和文档编写。

## 📈 监控工具

### Activity Monitor (macOS) / Task Manager (Windows)
**系统监控**，实时查看系统资源使用情况。

### htop
**命令行系统监控工具**，更加直观的进程管理。

## 🌐 浏览器工具

### Chrome DevTools
**Web 开发者必备**，用于前端调试和性能分析。

#### 常用功能：
- Elements 面板：DOM 和样式调试
- Console 面板：JavaScript 调试
- Network 面板：网络请求分析
- Performance 面板：性能分析

### React Developer Tools
**React 应用调试工具**，用于组件状态检查。

## 💫 工作流优化

### 日常开发流程

```bash
# 早上启动工作环境
alias work="code ~/Projects && open -a iTerm2"

# 快速创建 React 组件
function rfc() {
  echo "import React from 'react'

const $1 = () => {
  return (
    <div>
      $1
    </div>
  )
}

export default $1" > "$1.tsx"
}

# Git 快捷操作
alias gs="git status"
alias ga="git add ."
alias gc="git commit -m"
alias gp="git push"
alias gl="git log --oneline"
```

### 自动化脚本

```bash
#!/bin/bash
# 项目初始化脚本

echo "\ud83d\ude80 初始化项目..."

# 创建项目结构
mkdir -p src/{components,pages,utils,styles}
mkdir -p public/{images,icons}

# 安装基础依赖
pnpm install react react-dom typescript @types/react @types/react-dom

# 初始化 Git
git init
git add .
git commit -m "Initial commit"

echo "\u2705 项目初始化完成！"
```

## 📊 效率指标

使用这套工具链后，我的开发效率提升了：

- **代码编写速度** 提升 40%
- **调试时间** 减少 50%
- **项目初始化时间** 减少 70%
- **文档管理效率** 提升 60%

## 🔮 未来计划

我正在关注和尝试的新工具：

- **GitHub Copilot** - AI 代码助手
- **Cursor** - AI 驱动的代码编辑器
- **Linear** - 现代化项目管理
- **Raycast** - Alfred 的替代品

## 🎯 总结

选择合适的工具并不是一天两天的事情，需要不断尝试和调优。最重要的是找到适合自己工作流程的组合，而不是盲目追求最新最热的工具。

希望这份分享能对你有所帮助！如果你有更好的工具推荐，欢迎在评论区分享。

---

**相关阅读**：
- [如何打造高效的工作环境](/life/thoughts/workspace-setup)
- [时间管理的艺术](/life/thoughts/time-management)
- [技术学习方法论](/life/thoughts/learning-methods)