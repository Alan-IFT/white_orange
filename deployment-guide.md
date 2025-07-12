# 部署指南

## 快速部署

### 1. 准备工作
1. 确保已安装 Node.js 18+ 和 npm
2. 获取项目代码
3. 准备域名和必要的第三方服务

### 2. 本地开发
```bash
# 1. 安装依赖
npm install

# 2. 复制环境变量模板
cp .env.local.example .env.local

# 3. 编辑环境变量
nano .env.local

# 4. 启动开发服务器
npm run dev
```

### 3. 环境变量配置

**最小配置**（仅填写这些即可开始）：
```bash
NEXT_PUBLIC_SITE_NAME="你的博客名称"
NEXT_PUBLIC_SITE_DESCRIPTION="你的博客描述"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
NEXT_PUBLIC_AUTHOR_NAME="你的名字"
NEXT_PUBLIC_AUTHOR_EMAIL="your@email.com"
```

**完整配置**：
```bash
# 网站基本信息
NEXT_PUBLIC_SITE_NAME="个人博客"
NEXT_PUBLIC_SITE_DESCRIPTION="分享技术见解与生活感悟的个人博客"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
NEXT_PUBLIC_LANGUAGE="zh-CN"
NEXT_PUBLIC_LOCALE="zh_CN"

# 作者信息
NEXT_PUBLIC_AUTHOR_NAME="你的名字"
NEXT_PUBLIC_AUTHOR_EMAIL="your@email.com"
NEXT_PUBLIC_AUTHOR_BIO="全栈开发者，热爱技术与生活"
NEXT_PUBLIC_AUTHOR_LOCATION="中国"

# 社交媒体
NEXT_PUBLIC_SOCIAL_GITHUB="yourusername"
NEXT_PUBLIC_SOCIAL_TWITTER="@yourusername"
NEXT_PUBLIC_SOCIAL_LINKEDIN="yourusername"

# SEO
NEXT_PUBLIC_SEO_KEYWORDS="博客,技术,前端,后端,全栈开发"
NEXT_PUBLIC_OG_IMAGE="/images/og-image.jpg"

# 图片CDN（可选）
NEXT_PUBLIC_IMAGE_HOST="https://your-r2-domain.com"

# 分析工具（可选）
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_PLAUSIBLE_DOMAIN="yourdomain.com"

# 云存储（可选）
R2_ACCESS_KEY_ID="your_access_key"
R2_SECRET_ACCESS_KEY="your_secret_key"
R2_BUCKET_NAME="blog-images"
R2_ENDPOINT="https://xxx.r2.cloudflarestorage.com"

# 评论系统（可选）
GISCUS_REPO="username/blog-comments"
GISCUS_REPO_ID="R_kgDOJxxxxxx"
GISCUS_CATEGORY="Announcements"
GISCUS_CATEGORY_ID="DIC_kwDOJxxxxxx"
```

## 部署选项

### 🚀 方案一：自建服务器部署（推荐）

#### 使用 Docker + Nginx（推荐）

**1. 准备工作**
```bash
# 克隆项目
git clone https://github.com/yourusername/blog.git
cd blog

# 配置环境变量
cp .env.local.example .env.local
nano .env.local
```

**2. 构建和运行**
```bash
# 构建 Docker 镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看状态
docker-compose ps
```

**3. Nginx 配置**
```bash
# 编辑 Nginx 配置
nano nginx/sites-available/blog.conf

# 修改域名
server_name yourdomain.com www.yourdomain.com;

# 重启 Nginx
docker-compose restart nginx
```

**4. SSL 证书（Let's Encrypt）**
```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 设置自动续期
sudo crontab -e
# 添加：0 12 * * * /usr/bin/certbot renew --quiet
```

#### 使用 PM2 + Nginx

**1. 服务器环境准备**
```bash
# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
sudo npm install -g pm2

# 安装 Nginx
sudo apt update
sudo apt install nginx
```

**2. 项目部署**
```bash
# 克隆项目
git clone https://github.com/yourusername/blog.git
cd blog

# 安装依赖
npm install

# 配置环境变量
cp .env.local.example .env.local
nano .env.local

# 构建项目（服务器模式）
npm run build:server

# 启动 PM2
npm run pm2:start

# 设置开机自启
pm2 startup
pm2 save
```

**3. Nginx 配置**
```bash
# 复制 Nginx 配置
sudo cp nginx/sites-available/blog.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/blog.conf /etc/nginx/sites-enabled/

# 修改配置中的域名和上游服务器
sudo nano /etc/nginx/sites-available/blog.conf
# 将 server blog:3000; 改为 server 127.0.0.1:3000;

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

**4. 监控和管理**
```bash
# PM2 常用命令
pm2 list                 # 查看进程
pm2 logs blog           # 查看日志
pm2 restart blog        # 重启应用
pm2 stop blog           # 停止应用
pm2 monit               # 监控界面

# Nginx 常用命令
sudo systemctl status nginx    # 查看状态
sudo systemctl reload nginx    # 重载配置
sudo nginx -t                  # 测试配置
```

#### 环境变量配置（自建服务器）
```bash
# 自建服务器专用配置
NEXT_OUTPUT_MODE=standalone     # 服务器模式
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=你的博客名称
NEXT_PUBLIC_AUTHOR_NAME=你的名字
NEXT_PUBLIC_AUTHOR_EMAIL=your@email.com

# 其他配置...
```

### 🌐 方案二：Vercel 部署

**1. 连接 GitHub**
1. 将代码推送到 GitHub 仓库
2. 访问 [Vercel](https://vercel.com)
3. 选择 "New Project"
4. 导入你的 GitHub 仓库

**2. 配置环境变量**
在 Vercel 项目设置中添加环境变量：
```bash
# Vercel 专用配置
NEXT_OUTPUT_MODE=export         # 静态导出模式
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=你的博客名称
# ... 其他配置
```

**3. 部署设置**
```javascript
// vercel.json (可选)
{
  "buildCommand": "npm run build:static",
  "outputDirectory": "out",
  "trailingSlash": false,
  "cleanUrls": true
}
```

**4. 自定义域名**
1. 在 Vercel 项目设置中添加域名
2. 配置 DNS 记录指向 Vercel
3. 等待 SSL 证书自动配置

## 部署到 Netlify

### 1. 连接仓库
1. 访问 [Netlify](https://netlify.com)
2. 选择 "New site from Git"
3. 连接你的 GitHub 仓库

### 2. 构建设置
```javascript
// netlify.toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. 环境变量
在 Netlify 项目设置中添加环境变量。

## 部署到 Cloudflare Pages

### 1. 连接仓库
1. 访问 Cloudflare Pages
2. 连接你的 GitHub 仓库
3. 选择项目

### 2. 构建设置
- 构建命令：`npm run build`
- 输出目录：`out`
- Node.js 版本：18

### 3. 环境变量
在 Cloudflare Pages 设置中添加环境变量。

## 自定义部署

### 使用 Docker

**Dockerfile**：
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**docker-compose.yml**：
```yaml
version: '3.8'
services:
  blog:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SITE_URL=https://yourdomain.com
    env_file:
      - .env.local
```

### 使用 PM2

```bash
# 安装 PM2
npm install -g pm2

# 构建项目
npm run build

# 启动应用
pm2 start npm --name "blog" -- start

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
```

## 域名配置

### 1. DNS 设置
根据部署平台配置 DNS 记录：

**Vercel**：
```
A记录: @ -> 76.76.19.19
CNAME: www -> cname.vercel-dns.com
```

**Netlify**：
```
A记录: @ -> 75.2.60.5
CNAME: www -> your-site.netlify.app
```

**Cloudflare Pages**：
```
A记录: @ -> 192.0.2.1
CNAME: www -> your-site.pages.dev
```

### 2. SSL 证书
所有推荐的平台都提供免费的 SSL 证书自动配置。

## 图片存储配置

### Cloudflare R2 设置

1. **创建 R2 存储桶**：
   - 登录 Cloudflare 控制台
   - 创建新的 R2 存储桶
   - 记录存储桶名称和端点

2. **配置自定义域名**：
   - 在 R2 存储桶设置中添加自定义域名
   - 配置 DNS 记录
   - 更新环境变量 `NEXT_PUBLIC_IMAGE_HOST`

3. **获取 API 密钥**：
   - 创建 R2 API 令牌
   - 设置适当的权限
   - 添加到环境变量

### 图片上传工具

```javascript
// scripts/upload-image.js
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const s3 = new AWS.S3({
  endpoint: process.env.R2_ENDPOINT,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  region: 'auto',
});

async function uploadImage(filePath, key) {
  const fileContent = fs.readFileSync(filePath);
  
  const params = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: 'image/jpeg', // 根据文件类型调整
  };

  try {
    const result = await s3.upload(params).promise();
    console.log(`Upload successful: ${result.Location}`);
    return result.Location;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

module.exports = { uploadImage };
```

## 性能优化

### 1. 构建优化
```bash
# 分析打包大小
npm run analyze

# 优化构建
npm run build -- --analyze
```

### 2. 缓存策略
在部署平台配置缓存头：

```javascript
// next.config.js 已包含缓存配置
// 确保静态资源有正确的缓存头
```

### 3. CDN 配置
- 使用 Cloudflare 或其他 CDN 服务
- 配置图片 CDN (R2 + 自定义域名)
- 启用 Brotli 压缩

## 监控和维护

### 1. 错误监控
```javascript
// 可选：集成 Sentry
if (process.env.SENTRY_DSN) {
  require('@sentry/nextjs');
}
```

### 2. 性能监控
- 使用 Vercel Analytics
- 配置 Google Analytics
- 使用 Lighthouse CI

### 3. 自动化部署
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
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
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## 故障排除

### 常见问题

1. **构建失败**：
   - 检查环境变量是否正确设置
   - 确认 Node.js 版本兼容性
   - 查看构建日志

2. **图片不显示**：
   - 检查 `NEXT_PUBLIC_IMAGE_HOST` 配置
   - 确认图片路径正确
   - 检查 CORS 设置

3. **SEO 问题**：
   - 确认 `NEXT_PUBLIC_SITE_URL` 设置正确
   - 检查 meta 标签生成
   - 验证 sitemap 生成

### 调试命令
```bash
# 检查环境变量
npm run env

# 本地构建测试
npm run build && npm run start

# 类型检查
npm run type-check

# 代码检查
npm run lint
```

## 备份和恢复

### 1. 内容备份
```bash
# 备份 content 目录
tar -czf content-backup-$(date +%Y%m%d).tar.gz content/

# 自动备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d)
tar -czf "backups/content-$DATE.tar.gz" content/
```

### 2. 配置备份
- 备份 `.env.local` 文件（注意安全）
- 备份自定义配置文件
- 定期导出部署平台配置

通过以上配置，你的博客网站将具有完全可配置的域名和元数据，支持多环境部署和灵活的配置管理。