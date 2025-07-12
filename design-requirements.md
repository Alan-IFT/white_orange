# 设计需求规范

## 整体设计理念

### 设计哲学
- **内容为王**：设计服务于内容展示，避免过度装饰
- **简洁优雅**：采用简洁的设计语言，注重细节和用户体验
- **响应式设计**：确保在所有设备上都有良好的展示效果
- **无障碍访问**：遵循 WCAG 2.1 AA 标准

### 设计目标
1. 提供优秀的阅读体验
2. 快速加载和流畅交互
3. 清晰的信息架构
4. 一致的视觉语言

## 视觉设计系统

### 色彩方案

#### 主色调
```css
/* 白橙主题色彩系统 */
:root {
  /* 主色调 - 橙色系 */
  --primary-50: #fff7ed;
  --primary-100: #ffedd5;
  --primary-200: #fed7aa;
  --primary-300: #fdba74;
  --primary-400: #fb923c;
  --primary-500: #f97316;  /* 主色 */
  --primary-600: #ea580c;
  --primary-700: #c2410c;
  --primary-800: #9a3412;
  --primary-900: #7c2d12;
  
  /* 辅助色 - 灰色系 */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  
  /* 状态色 */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}
```

#### 暗黑模式
```css
/* 暗黑模式色彩 */
.dark {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --text-tertiary: #64748b;
  --border: #334155;
  --accent: #f97316;
}
```

### 字体系统

#### 字体选择
```css
/* 字体配置 */
:root {
  /* 中文字体 */
  --font-sans: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  
  /* 代码字体 */
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Source Code Pro', monospace;
  
  /* 标题字体 */
  --font-heading: 'Inter', 'PingFang SC', sans-serif;
}
```

#### 字体大小系统
```css
/* 字体大小 */
:root {
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px */
  --text-6xl: 3.75rem;    /* 60px */
}
```

### 间距系统
```css
/* 间距系统 */
:root {
  --space-1: 0.25rem;     /* 4px */
  --space-2: 0.5rem;      /* 8px */
  --space-3: 0.75rem;     /* 12px */
  --space-4: 1rem;        /* 16px */
  --space-5: 1.25rem;     /* 20px */
  --space-6: 1.5rem;      /* 24px */
  --space-8: 2rem;        /* 32px */
  --space-10: 2.5rem;     /* 40px */
  --space-12: 3rem;       /* 48px */
  --space-16: 4rem;       /* 64px */
  --space-20: 5rem;       /* 80px */
  --space-24: 6rem;       /* 96px */
}
```

### 圆角和阴影
```css
/* 圆角 */
:root {
  --radius-sm: 0.125rem;  /* 2px */
  --radius-md: 0.375rem;  /* 6px */
  --radius-lg: 0.5rem;    /* 8px */
  --radius-xl: 0.75rem;   /* 12px */
  --radius-2xl: 1rem;     /* 16px */
  --radius-full: 9999px;
}

/* 阴影 */
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
```

## 布局设计

### 推荐布局：顶部导航
```
┌─────────────────────────────────────────────────────────────┐
│                        Header                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                      Main Content                           │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                Article Content                      │    │
│  │                                                     │    │
│  │  ┌─────────────┐  ┌─────────────────────────────┐   │    │
│  │  │    TOC      │  │       Article Body         │   │    │
│  │  │ (Desktop)   │  │                             │   │    │
│  │  │             │  │                             │   │    │
│  │  └─────────────┘  └─────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                        Footer                               │
└─────────────────────────────────────────────────────────────┘
```

### 响应式断点
```css
/* 响应式断点 */
:root {
  --bp-sm: 640px;   /* 手机 */
  --bp-md: 768px;   /* 平板 */
  --bp-lg: 1024px;  /* 桌面 */
  --bp-xl: 1280px;  /* 大屏 */
  --bp-2xl: 1536px; /* 超大屏 */
}
```

### 容器尺寸
```css
/* 容器最大宽度 */
:root {
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1400px;
}
```

## 组件设计规范

### 导航栏 (Header)
```typescript
interface HeaderProps {
  // 导航项配置
  navigation: {
    label: string;
    href: string;
    icon?: LucideIcon;
  }[];
  
  // 当前页面路径
  currentPath: string;
  
  // 是否显示搜索框
  showSearch?: boolean;
  
  // 是否显示主题切换
  showThemeToggle?: boolean;
}
```

**设计要求**：
- 高度：64px (桌面) / 56px (移动端)
- 背景：半透明模糊效果
- 固定在顶部，滚动时显示阴影
- 移动端使用汉堡菜单

### 文章卡片 (ArticleCard)
```typescript
interface ArticleCardProps {
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  category: string;
  tags: string[];
  coverImage?: string;
  slug: string;
  featured?: boolean;
}
```

**设计要求**：
- 卡片样式：圆角、阴影、悬浮效果
- 支持封面图片（可选）
- 清晰的层级结构
- 响应式网格布局

### 文章内容 (ArticleContent)
```typescript
interface ArticleContentProps {
  content: string;
  tableOfContents?: TOCItem[];
  showTOC?: boolean;
  showReadingProgress?: boolean;
}
```

**设计要求**：
- 最大宽度：65 字符（约 720px）
- 行高：1.7
- 段落间距：1.5rem
- 代码块：语法高亮 + 复制按钮
- 图片：懒加载 + 点击放大

### 目录 (TableOfContents)
```typescript
interface TOCProps {
  items: TOCItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
}
```

**设计要求**：
- 桌面端：固定侧边栏
- 移动端：可折叠的顶部区域
- 当前阅读位置高亮
- 平滑滚动导航

### 搜索框 (SearchBox)
```typescript
interface SearchBoxProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
}
```

**设计要求**：
- 支持实时搜索
- 键盘快捷键支持 (⌘K)
- 搜索建议和历史记录
- 移动端优化

### 标签 (Tag)
```typescript
interface TagProps {
  children: string;
  variant?: 'default' | 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  onClick?: () => void;
}
```

**设计要求**：
- 多种样式变体
- 支持点击跳转
- 颜色区分不同类型
- 圆角边框设计

## 交互设计

### 动画效果
```css
/* 过渡动画 */
:root {
  --transition-fast: 150ms ease-out;
  --transition-base: 250ms ease-out;
  --transition-slow: 350ms ease-out;
}

/* 常用动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### 加载状态
- 骨架屏：文章列表和内容加载
- 加载指示器：搜索和页面跳转
- 渐进式加载：图片和代码块

### 用户反馈
- 悬浮状态：按钮和链接
- 点击状态：短暂的视觉反馈
- 错误状态：表单验证和网络错误
- 成功状态：操作完成提示

## 主题系统

### 主题切换
```typescript
interface ThemeConfig {
  default: 'light' | 'dark' | 'system';
  storage: 'localStorage' | 'cookie';
  attribute: 'class' | 'data-theme';
  themes: {
    light: Theme;
    dark: Theme;
  };
}
```

### 自定义主题
```typescript
interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    border: string;
    accent: string;
  };
  fonts: {
    sans: string;
    mono: string;
    heading: string;
  };
  spacing: Record<string, string>;
  radius: Record<string, string>;
  shadows: Record<string, string>;
}
```

## 无障碍设计

### 键盘导航
- Tab 键顺序合理
- 焦点状态明显
- 跳转到主要内容
- 键盘快捷键支持

### 屏幕阅读器
- 语义化 HTML 结构
- 适当的 ARIA 标签
- 图片 alt 属性
- 表单标签关联

### 视觉辅助
- 高对比度支持
- 文字大小可调节
- 颜色不作为唯一区分
- 减少动画选项

## 性能优化

### 图片优化
```typescript
interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}
```

### 字体优化
```css
/* 字体加载优化 */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
```

### 代码分割
- 路由级别分割
- 组件懒加载
- 第三方库按需加载
- 关键 CSS 内联

## 设计检查清单

### 视觉一致性
- [ ] 颜色使用一致
- [ ] 字体大小合理
- [ ] 间距规范统一
- [ ] 组件状态完整

### 响应式设计
- [ ] 移动端适配
- [ ] 平板端优化
- [ ] 桌面端体验
- [ ] 超大屏适配

### 交互体验
- [ ] 加载状态完善
- [ ] 错误处理友好
- [ ] 反馈及时明确
- [ ] 操作流程顺畅

### 无障碍性
- [ ] 键盘导航完整
- [ ] 屏幕阅读器支持
- [ ] 对比度符合标准
- [ ] 语义化标签正确

### 性能表现
- [ ] 首屏加载快速
- [ ] 图片优化完成
- [ ] 代码分割合理
- [ ] 缓存策略有效

## 设计资源

### 设计工具
- Figma：界面设计和原型
- Excalidraw：流程图和草图
- Coolors：配色方案生成
- Google Fonts：字体选择

### 图标库
- Lucide React：轻量级图标库
- Heroicons：Tailwind 团队出品
- Tabler Icons：开源图标集合

### 设计参考
- Tailwind UI：组件设计参考
- Vercel Design：简洁现代风格
- Linear：产品设计优秀案例
- Stripe：企业级设计系统

这个设计规范为博客网站提供了完整的视觉和交互设计指导，确保网站具有一致的用户体验和专业的视觉呈现。