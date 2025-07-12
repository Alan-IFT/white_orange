# 技术选择推荐

## 核心技术栈

### 静态站点生成器：Next.js 14
**推荐理由**：
- 优秀的 SEO 支持（静态生成 + 服务端渲染）
- 出色的性能表现（Core Web Vitals 优化）
- 丰富的生态系统和插件支持
- 完善的图片优化和代码分割
- 活跃的社区和详细的文档
- 支持多种部署模式（静态导出 + 服务器模式）

**替代方案**：
- Astro：更专注于内容站点，构建速度更快
- Nuxt.js：如果更熟悉 Vue.js 生态

### 部署策略：多选项支持

#### 方案一：自建服务器（推荐）
**优势**：
- 完全控制服务器环境
- 成本可控，适合长期运营
- 支持服务器端渲染和动态功能
- 可以自定义缓存策略
- 更好的隐私控制

**技术选择**：
- **Docker + Nginx**：容器化部署，易于维护
- **PM2 + Nginx**：传统 Node.js 部署方式
- **静态 + Nginx**：纯静态文件服务

#### 方案二：云平台托管
**Vercel**：
- 对 Next.js 有最佳支持（同一公司产品）
- 自动化部署和预览环境
- 全球 CDN 和边缘函数支持
- 免费额度充足，适合个人博客

**Netlify**：
- 功能相近，更多插件生态
- 静态站点特化优化
- 简单的表单处理

**Cloudflare Pages**：
- 全球 CDN 性能优秀
- 与 Cloudflare 生态集成
- 优秀的边缘性能

### 图片存储：Cloudflare R2
**推荐理由**：
- 与 Cloudflare CDN 完美集成
- 成本低廉（免费额度 10GB）
- 全球边缘缓存
- 支持自定义域名
- 与 Cloudflare 其他服务协同

**配置步骤**：
1. 创建 R2 存储桶
2. 配置自定义域名（如 `r2.yourdomain.com`）
3. 设置 CORS 策略
4. 获取 API 密钥用于上传工具

## 技术实现细节

### 项目结构
```
blog-website/
├── app/                    # Next.js 14 App Router
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── blog/
│   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── categories/
│   │   └── [category]/
│   │       └── page.tsx
│   └── about/
│       └── page.tsx
├── components/             # 可复用组件
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── BlogCard.tsx
│   ├── TableOfContents.tsx
│   └── SearchBox.tsx
├── lib/                    # 工具函数
│   ├── mdx.ts             # Markdown 处理
│   ├── posts.ts           # 文章数据处理
│   └── utils.ts           # 通用工具
├── content/                # 你的博客内容
│   ├── tech/
│   ├── life/
│   └── projects/
├── public/                 # 静态资源
├── types/                  # TypeScript 类型定义
├── site.config.ts          # 网站配置
├── tailwind.config.js      # Tailwind 配置
├── next.config.js          # Next.js 配置
└── package.json
```

### 核心依赖包
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "gray-matter": "^4.0.3",
    "next-mdx-remote": "^4.4.1",
    "remark": "^15.0.1",
    "remark-gfm": "^4.0.0",
    "rehype-highlight": "^7.0.0",
    "rehype-slug": "^6.0.0",
    "rehype-autolink-headings": "^7.0.0",
    "lucide-react": "^0.294.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.3.0",
    "eslint": "^8.55.0",
    "eslint-config-next": "14.0.0"
  }
}
```

### Next.js 配置
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    domains: ['r2.whiteorange.dev'],
    unoptimized: true
  },
  experimental: {
    mdxRs: true
  },
  async redirects() {
    return [
      {
        source: '/feed',
        destination: '/feed.xml',
        permanent: true,
      },
    ]
  }
}

module.exports = nextConfig
```

## 开发工具推荐

### 代码编辑器设置
**VS Code 扩展**：
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- MDX
- Auto Rename Tag
- Prettier - Code formatter
- ESLint
- Docker（如果使用容器化部署）

### 图片处理工具
**推荐工具**：
- Squoosh.app：在线图片压缩
- Sharp：Node.js 图片处理库
- ImageOptim：Mac 图片优化工具

### 部署和监控
**自建服务器部署脚本**：
```bash
# 使用项目内置脚本
./scripts/deploy.sh docker    # Docker 部署
./scripts/deploy.sh pm2       # PM2 部署
./scripts/deploy.sh static    # 静态部署

# SSL 证书配置
sudo ./scripts/ssl-setup.sh yourdomain.com
```

**云平台 CI/CD 配置**：
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:static  # 静态构建
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 性能优化配置

### 图片优化
```typescript
// lib/image-config.ts
export const imageConfig = {
  domains: ['r2.whiteorange.dev'],
  formats: ['image/webp', 'image/avif'],
  sizes: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  }
}
```

### 缓存策略
```javascript
// Cache-Control 配置
const cacheConfig = {
  // 静态资源
  'public, max-age=31536000, immutable': ['/_next/static/'],
  // HTML 页面
  'public, max-age=0, must-revalidate': ['/'],
  // API 路由
  'public, max-age=3600': ['/api/'],
  // 图片资源
  'public, max-age=2592000': ['/images/']
}
```

## 安全配置

### 环境变量配置

项目使用环境变量进行配置，支持灵活的部署和多环境管理。

**配置步骤**：
1. 复制环境变量模板：
   ```bash
   cp .env.local.example .env.local
   ```

2. 填写基本配置：
   ```bash
   # 网站基本信息
   NEXT_PUBLIC_SITE_NAME="你的博客名称"
   NEXT_PUBLIC_SITE_DESCRIPTION="你的博客描述"
   NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
   
   # 作者信息
   NEXT_PUBLIC_AUTHOR_NAME="你的名字"
   NEXT_PUBLIC_AUTHOR_EMAIL="your@email.com"
   
   # 可选配置
   NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
   NEXT_PUBLIC_IMAGE_HOST="https://your-r2-domain.com"
   ```

3. 高级配置（可选）：
   ```bash
   # Cloudflare R2 存储
   R2_ACCESS_KEY_ID=your_access_key
   R2_SECRET_ACCESS_KEY=your_secret_key
   R2_BUCKET_NAME=blog-images
   R2_ENDPOINT=https://xxxx.r2.cloudflarestorage.com
   
   # 评论系统
   GISCUS_REPO=username/blog-comments
   GISCUS_REPO_ID=R_kgDOJxxxxxx
   ```

**环境变量说明**：
- `NEXT_PUBLIC_*`: 客户端可访问的变量
- 其他变量仅在服务端可用，用于敏感信息

### 安全头配置
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]
```

## 开发工作流

### 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run start

# 导出静态文件
npm run export

# 代码检查
npm run lint

# 格式化代码
npm run format
```

### 内容管理工作流
1. **创建文章**：在 `content/` 目录下创建 Markdown 文件
2. **本地预览**：使用 `npm run dev` 预览效果
3. **提交代码**：Git 提交并推送到 GitHub
4. **自动部署**：Vercel 自动构建和部署
5. **验证上线**：检查网站是否正常运行

### 图片管理工作流
1. **图片优化**：使用 Squoosh 等工具压缩图片
2. **上传到 R2**：使用 Cloudflare 控制台或 API 上传
3. **获取链接**：复制图片的 CDN 链接
4. **使用图片**：在 Markdown 中引用图片链接

## 监控和分析

### 性能监控
- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Lighthouse CI

### 访问分析
- Google Analytics 4
- Vercel Analytics
- Plausible（隐私友好的替代方案）

### 错误监控
- Sentry（可选）
- Vercel 内置错误监控

## 成本估算

### 免费资源
- Vercel：免费额度充足（100GB 带宽/月）
- Cloudflare R2：10GB 免费存储
- GitHub：无限制的公共仓库

### 付费升级（可选）
- Vercel Pro：$20/月（更多带宽和功能）
- Cloudflare R2：$0.015/GB/月（超出免费额度）
- 自定义域名：$10-15/年

**总计**：
- 自建服务器：服务器成本 $5-20/月 + 域名 $10-15/年
- 云平台托管：基本免费，可选域名费用约 $10-15/年

## 部署模式对比

| 特性 | 自建服务器 | 云平台托管 |
|------|------------|------------|
| 成本 | 中等（服务器费用） | 低（免费额度） |
| 控制度 | 完全控制 | 有限控制 |
| 可扩展性 | 需手动配置 | 自动扩展 |
| 维护成本 | 较高 | 极低 |
| 功能限制 | 无限制 | 平台限制 |
| 隐私控制 | 完全控制 | 依赖平台 |
| 性能 | 取决于服务器 | 全球 CDN |
| 适用场景 | 长期运营，需要控制 | 快速上线，简单维护 |

## 技术选择建议

### 选择自建服务器的情况：
- 需要完全控制服务器环境
- 有服务器运维经验
- 长期运营，成本敏感
- 需要特殊功能或配置
- 对数据隐私有严格要求

### 选择云平台托管的情况：
- 快速上线，简单维护
- 没有服务器运维经验
- 个人博客，流量不大
- 需要全球 CDN 加速
- 预算有限，想要免费方案