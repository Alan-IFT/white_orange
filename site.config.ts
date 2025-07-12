// 网站配置文件 - Next.js 15.3.5+ & React 19.1.0+ 兼容
// 基于官方文档和最新最佳实践
import { validateEnv } from './lib/security-config'

// 在配置加载时验证环境变量
validateEnv()

export const siteConfig = {
  // 基本信息（可通过环境变量覆盖）
  name: process.env.NEXT_PUBLIC_SITE_NAME || "个人博客",
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "分享技术见解与生活感悟的个人博客",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000",
  
  // 作者信息（可通过环境变量覆盖）
  author: {
    name: process.env.NEXT_PUBLIC_AUTHOR_NAME || "博主",
    email: process.env.NEXT_PUBLIC_AUTHOR_EMAIL || "contact@example.com",
    bio: process.env.NEXT_PUBLIC_AUTHOR_BIO || "一个热爱技术与生活的开发者",
    avatar: process.env.NEXT_PUBLIC_AUTHOR_AVATAR || "/images/avatar.jpg",
    location: process.env.NEXT_PUBLIC_AUTHOR_LOCATION || "地球",
    social: {
      twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || "",
      github: process.env.NEXT_PUBLIC_SOCIAL_GITHUB || "",
      linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "",
      email: process.env.NEXT_PUBLIC_AUTHOR_EMAIL || "contact@example.com"
    }
  },
  
  // 语言和地区
  language: "zh-CN",
  locale: "zh-CN",
  timezone: "Asia/Shanghai",
  
  // SEO 配置
  seo: {
    defaultTitle: process.env.NEXT_PUBLIC_SITE_NAME || "个人博客",
    titleTemplate: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME || "个人博客"}`,
    defaultDescription: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "分享技术见解与生活感悟的个人博客，专注于前端开发、后端技术、产品思维和个人成长",
    keywords: (process.env.NEXT_PUBLIC_SEO_KEYWORDS || "博客,技术博客,前端开发,后端技术,全栈开发,React,Next.js,JavaScript,TypeScript,Node.js,个人成长,产品思维").split(","),
    openGraph: {
      type: "website",
      locale: process.env.NEXT_PUBLIC_LOCALE || "zh_CN",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000",
      siteName: process.env.NEXT_PUBLIC_SITE_NAME || "个人博客",
      images: [
        {
          url: process.env.NEXT_PUBLIC_OG_IMAGE || "/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: process.env.NEXT_PUBLIC_SITE_NAME || "个人博客"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      site: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || "",
      creator: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || ""
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1
      }
    }
  },
  
  // 主题配置
  theme: {
    // 默认主题
    default: "light", // 'light' | 'dark' | 'system'
    
    // 主色调
    primaryColor: "#f97316", // orange-500
    
    // 支持暗黑模式
    darkMode: true,
    
    // 布局类型
    layout: "top-nav", // 'top-nav' | 'sidebar'
    
    // 字体配置
    fonts: {
      sans: "Inter, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', 'Source Code Pro', monospace",
      heading: "Inter, 'PingFang SC', sans-serif"
    },
    
    // 动画配置
    animations: {
      enabled: true,
      duration: "250ms",
      easing: "ease-out"
    }
  },
  
  // 功能配置
  features: {
    // 评论系统
    comments: {
      enabled: true,
      provider: "giscus", // 'giscus' | 'disqus' | 'utterances'
      config: {
        repo: "whiteorange/blog-comments",
        repoId: "R_kgDOJxxxxxx",
        category: "Announcements",
        categoryId: "DIC_kwDOJxxxxxx",
        mapping: "pathname",
        strict: "0",
        reactionsEnabled: "1",
        emitMetadata: "0",
        inputPosition: "top",
        theme: "preferred_color_scheme",
        lang: "zh-CN",
        loading: "lazy"
      }
    },
    
    // 搜索功能
    search: {
      enabled: true,
      provider: "local", // 'local' | 'algolia'
      config: {
        placeholder: "搜索文章...",
        maxResults: 10,
        hotkeys: ["cmd+k", "ctrl+k"]
      }
    },
    
    // RSS 订阅
    rss: {
      enabled: true,
      title: process.env.NEXT_PUBLIC_SITE_NAME || "个人博客",
      description: `${process.env.NEXT_PUBLIC_SITE_NAME || "个人博客"}的最新文章`,
      feedUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000"}/feed.xml`,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000",
      copyright: `Copyright © ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_SITE_NAME || "个人博客"}`,
      language: process.env.NEXT_PUBLIC_LANGUAGE || "zh-CN",
      ttl: 60
    },
    
    // 文章目录
    tableOfContents: {
      enabled: true,
      levels: [2, 3, 4], // h2, h3, h4
      position: "sidebar", // 'sidebar' | 'top'
      sticky: true
    },
    
    // 阅读时间
    readingTime: {
      enabled: true,
      wordsPerMinute: 200, // 中文阅读速度
      locale: "zh-CN"
    },
    
    // 相关文章
    relatedPosts: {
      enabled: true,
      count: 3,
      algorithm: "tags" // 'tags' | 'categories' | 'content'
    },
    
    // 阅读进度
    readingProgress: {
      enabled: true,
      position: "top", // 'top' | 'bottom'
      color: "#f97316"
    },
    
    // 代码复制
    codeBlock: {
      copyButton: true,
      lineNumbers: true,
      theme: "github-dark", // 'github-light' | 'github-dark'
      languages: [
        "javascript",
        "typescript",
        "jsx",
        "tsx",
        "css",
        "html",
        "json",
        "markdown",
        "bash",
        "python",
        "sql",
        "yaml"
      ]
    },
    
    // 图片优化
    imageOptimization: {
      enabled: true,
      lazyLoading: true,
      placeholder: "blur",
      formats: ["webp", "avif"],
      quality: 80,
      sizes: {
        small: 640,
        medium: 1024,
        large: 1920
      }
    },
    
    // 分享功能
    share: {
      enabled: true,
      platforms: ["twitter", "facebook", "linkedin", "copy"],
      text: "分享这篇文章"
    },
    
    // 打印友好
    print: {
      enabled: true,
      hideElements: [".no-print", ".comments", ".share-buttons"]
    }
  },
  
  // 性能监控配置 (参考 lib/performance-monitoring.ts)
  performance: {
    // Core Web Vitals 阈值
    vitals: {
      LCP: { good: 2500, needsImprovement: 4000 },
      FID: { good: 100, needsImprovement: 300 },
      CLS: { good: 0.1, needsImprovement: 0.25 },
      FCP: { good: 1800, needsImprovement: 3000 },
      INP: { good: 200, needsImprovement: 500 },
      TTFB: { good: 800, needsImprovement: 1800 }
    },
    
    // 内存监控
    memory: {
      warningThreshold: 100, // MB
      criticalThreshold: 200, // MB
      monitoringInterval: 30000 // ms
    },
    
    // 错误监控
    errorLogging: {
      enabled: true,
      batchSize: 5,
      flushInterval: 30000,
      maxErrors: 100
    },
    
    // 启用实时监控
    realTimeMonitoring: true
  },
  
  // 错误处理配置 (参考 lib/error-handling.ts)
  errorHandling: {
    // 网络重试配置
    networkRetry: {
      maxRetries: 3,
      retryDelay: 1000,
      exponentialBackoff: true
    },
    
    // 图片错误处理
    imageErrorHandling: {
      enableFallback: true,
      fallbackImage: '/images/placeholder.jpg',
      showPlaceholder: true
    },
    
    // 离线体验
    offlineHandling: {
      showNotification: true,
      cacheFallback: true
    }
  },
  
  // 分析和监控
  analytics: {
    // Google Analytics
    googleAnalytics: {
      enabled: !!process.env.NEXT_PUBLIC_GA_ID,
      id: process.env.NEXT_PUBLIC_GA_ID || "",
      config: {
        anonymize_ip: true,
        cookie_expires: 63072000, // 2 years
        send_page_view: true
      }
    },
    
    // Vercel Analytics
    vercelAnalytics: {
      enabled: true
    },
    
    // Plausible Analytics (隐私友好的替代方案)
    plausible: {
      enabled: !!process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
      domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "",
      apiHost: process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST || "https://plausible.io"
    }
  },
  
  // 构建配置
  build: {
    // 每页文章数
    postsPerPage: 10,
    
    // 摘要长度
    excerptLength: 160,
    
    // 日期格式
    dateFormat: {
      full: "YYYY年MM月DD日", // 2024年1月15日
      short: "YYYY-MM-DD",    // 2024-01-15
      iso: "YYYY-MM-DDTHH:mm:ss.sssZ" // ISO 8601
    },
    
    // 输出目录
    outputDir: "out",
    
    // 静态文件目录
    publicDir: "public",
    
    // 内容目录
    contentDir: "content",
    
    // 支持的文件类型
    supportedFormats: ["md", "mdx"],
    
    // 草稿处理
    drafts: {
      enabled: process.env.NODE_ENV === "development",
      folder: "drafts"
    }
  },
  
  // 导航配置
  navigation: {
    // 主导航
    main: [
      {
        label: "首页",
        href: "/",
        icon: "home"
      },
      {
        label: "博客",
        href: "/blog",
        icon: "bookmark"
      },
      {
        label: "分类",
        href: "/categories",
        icon: "folder"
      },
      {
        label: "标签",
        href: "/tags",
        icon: "tag"
      },
      {
        label: "项目",
        href: "/projects",
        icon: "code"
      },
      {
        label: "关于",
        href: "/about",
        icon: "user"
      }
    ],
    
    // 底部导航
    footer: [
      {
        label: "隐私政策",
        href: "/privacy"
      },
      {
        label: "RSS",
        href: "/feed.xml",
        external: true
      },
      {
        label: "站点地图",
        href: "/sitemap.xml",
        external: true
      }
    ],
    
    // 社交链接
    social: [
      {
        label: "GitHub",
        href: "https://github.com/whiteorange",
        icon: "github"
      },
      {
        label: "Twitter",
        href: "https://twitter.com/whiteorange_dev",
        icon: "twitter"
      },
      {
        label: "LinkedIn",
        href: "https://linkedin.com/in/whiteorange",
        icon: "linkedin"
      },
      {
        label: "Email",
        href: "mailto:contact@whiteorange.dev",
        icon: "mail"
      }
    ]
  },
  
  // 内容分类配置
  categories: {
    // 技术分类
    tech: {
      label: "技术",
      description: "技术相关的文章和教程",
      color: "#3b82f6", // blue-500
      icon: "code"
    },
    
    // 生活分类
    life: {
      label: "生活",
      description: "生活感悟和个人思考",
      color: "#10b981", // green-500
      icon: "heart"
    },
    
    // 项目分类
    projects: {
      label: "项目",
      description: "个人项目和开源作品",
      color: "#f59e0b", // yellow-500
      icon: "briefcase"
    }
  },
  
  // 图片和媒体配置
  media: {
    // 图片CDN
    imageHost: process.env.NEXT_PUBLIC_IMAGE_HOST || "",
    
    // 默认图片
    defaultImages: {
      avatar: process.env.NEXT_PUBLIC_AUTHOR_AVATAR || "/images/avatar.jpg",
      ogImage: process.env.NEXT_PUBLIC_OG_IMAGE || "/images/og-image.jpg",
      favicon: "/images/favicon.ico",
      appleTouchIcon: "/images/apple-touch-icon.png"
    },
    
    // 图片尺寸
    imageSizes: {
      thumbnail: 300,
      small: 600,
      medium: 1200,
      large: 1920
    }
  },
  
  // 缓存配置
  cache: {
    // 静态资源缓存（秒）
    staticAssets: 31536000, // 1 年
    
    // 页面缓存（秒）
    pages: 3600, // 1 小时
    
    // API 缓存（秒）
    api: 300, // 5 分钟
    
    // 图片缓存（秒）
    images: 2592000 // 30 天
  },
  
  // 安全配置
  security: {
    // CSP 策略 (参考 lib/security-config.ts 的完整配置)
    contentSecurityPolicy: {
      "default-src": ["'self'"],
      "script-src": [
        "'self'",
        "'unsafe-inline'", // Next.js 15 需要
        "'unsafe-eval'",   // 开发环境需要
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com",
        "https://cdn.vercel-analytics.com"
      ],
      "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
      "img-src": [
        "'self'",
        "data:",
        "blob:",
        "https:",
        "https://images.unsplash.com",
        "https://r2.cloudflarestorage.com"
      ],
      "connect-src": [
        "'self'",
        "https://www.google-analytics.com",
        "https://vitals.vercel-analytics.com",
        "https://api.github.com"
      ],
      "object-src": ["'none'"],
      "base-uri": ["'self'"],
      "form-action": ["'self'"],
      "frame-ancestors": ["'none'"],
      "upgrade-insecure-requests": []
    },
    
    // 安全头部 (参考 lib/security-config.ts)
    headers: {
      "X-DNS-Prefetch-Control": "off",
      "X-XSS-Protection": "1; mode=block",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
    },
    
    // 启用详细的安全配置
    enableAdvancedSecurity: true,
    
    // 输入验证配置
    inputValidation: {
      maxContentLength: 50000,
      allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
      maxImageSize: 5 * 1024 * 1024, // 5MB
      sanitizeHTML: true,
      preventXSS: true
    }
  }
};

// 导出类型定义
export type SiteConfig = typeof siteConfig;

// 环境变量类型定义 (基于 lib/security-config.ts 的 EnvSchema)
export interface EnvironmentConfig {
  // 系统环境
  NODE_ENV: "development" | "production" | "test";
  NEXT_OUTPUT_MODE?: "export" | "standalone";
  
  // 站点信息 (必需)
  NEXT_PUBLIC_SITE_NAME: string;
  NEXT_PUBLIC_SITE_DESCRIPTION: string;
  NEXT_PUBLIC_SITE_URL: string;
  NEXT_PUBLIC_AUTHOR_NAME: string;
  NEXT_PUBLIC_AUTHOR_EMAIL: string;
  
  // 可选配置
  NEXT_PUBLIC_AUTHOR_AVATAR?: string;
  NEXT_PUBLIC_SOCIAL_GITHUB?: string;
  NEXT_PUBLIC_SOCIAL_TWITTER?: string;
  NEXT_PUBLIC_SOCIAL_LINKEDIN?: string;
  
  // 图片和存储
  NEXT_PUBLIC_IMAGE_HOST?: string;
  CLOUDFLARE_R2_ACCESS_KEY_ID?: string;
  CLOUDFLARE_R2_SECRET_ACCESS_KEY?: string;
  CLOUDFLARE_R2_BUCKET_NAME?: string;
  CLOUDFLARE_R2_ENDPOINT?: string;
  
  // 分析工具
  NEXT_PUBLIC_GA_ID?: string;
  NEXT_PUBLIC_VERCEL_ANALYTICS?: string;
  
  // API 密钥
  GITHUB_TOKEN?: string;
  OPENAI_API_KEY?: string;
  
  // 评论系统
  GISCUS_REPO?: string;
  GISCUS_REPO_ID?: string;
  GISCUS_CATEGORY?: string;
  GISCUS_CATEGORY_ID?: string;
}

// 运行时配置 (兼容 Next.js 15.3.5+ 和 React 19.1.0+)
export const runtimeConfig = {
  // 环境检测
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  
  // 输出模式
  outputMode: process.env.NEXT_OUTPUT_MODE || "standalone",
  isStaticExport: process.env.NEXT_OUTPUT_MODE === "export",
  
  // 基础配置
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000",
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "个人博客",
  
  // 分析工具
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
  vercelAnalytics: !!process.env.NEXT_PUBLIC_VERCEL_ANALYTICS,
  
  // 特性标志
  features: {
    performanceMonitoring: true,
    errorBoundaries: true,
    securityValidation: true,
    offlineSupport: true
  },
  
  // 版本信息
  versions: {
    nextjs: "15.3.5+",
    react: "19.1.0+",
    typescript: "5.7.2+",
    node: "22.17.0+"
  }
};

// 配置验证函数
export function validateSiteConfig(): boolean {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SITE_NAME',
    'NEXT_PUBLIC_SITE_DESCRIPTION',
    'NEXT_PUBLIC_SITE_URL',
    'NEXT_PUBLIC_AUTHOR_NAME',
    'NEXT_PUBLIC_AUTHOR_EMAIL'
  ];
  
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('缺少必需的环境变量:', missing);
    return false;
  }
  
  return true;
}

// 生产环境配置检查
if (runtimeConfig.isProduction && !validateSiteConfig()) {
  throw new Error('生产环境配置验证失败');
}

export default siteConfig;