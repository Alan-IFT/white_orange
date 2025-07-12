/** @type {import('next').NextConfig} */
// Next.js 15.3.5+ 配置 - 兼容 React 19.1.0+
// 基于官方文档和最新最佳实践
const nextConfig = {
  // 输出模式：根据环境变量决定
  output: process.env.NEXT_OUTPUT_MODE === 'export' ? 'export' : 'standalone',
  
  // 图片优化配置
  images: {
    unoptimized: process.env.NEXT_OUTPUT_MODE === 'export',
    domains: [
      process.env.NEXT_PUBLIC_IMAGE_HOST?.replace('https://', '').replace('http://', '') || 'localhost',
      'localhost'
    ].filter(Boolean),
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    loader: 'default',
    path: '/_next/image/',
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // 服务器外部包配置 (从experimental移出)
  serverExternalPackages: ['sharp'],
  
  // 启用实验性功能 (Next.js 15.3.5+ 兼容)
  experimental: {
    // React 19 兼容性
    reactCompiler: false, // 等待稳定版本
    
    // 性能优化
    optimizePackageImports: ['lucide-react', 'framer-motion', 'date-fns'],
  },
  
  // 编译器选项 (React 19.1.0+ 优化)
  compiler: {
    // 移除 console.log (生产环境)
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
    
    // React 编译器 (React 19 新特性)
    reactRemoveProperties: process.env.NODE_ENV === 'production',
    
    // 样式化组件支持
    styledComponents: false
  },
  
  // 静态文件处理
  trailingSlash: false,
  
  // 页面扩展名
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  
  // 环境变量
  env: {
    CUSTOM_KEY: 'my-value',
  },
  
  // 重定向
  async redirects() {
    return [
      {
        source: '/feed',
        destination: '/feed.xml',
        permanent: true,
      },
      {
        source: '/rss',
        destination: '/feed.xml',
        permanent: true,
      },
    ];
  },
  
  // 重写
  async rewrites() {
    return [];
  },
  
  // 头部设置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000',
          },
        ],
      },
    ];
  },
  
  // Webpack 配置
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 添加 raw-loader 支持
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    
    // 添加 SVG 支持
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    // 优化打包
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }
    
    return config;
  },
  
  // 性能预算
  productionBrowserSourceMaps: false,
  
  // 压缩配置
  compress: true,
  
  // 隐藏 Next.js 版本信息
  poweredByHeader: false,
  
  // 开发体验优化
  devIndicators: {
    position: 'bottom-right',
  },
  
  // 日志配置
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
  
  // 类型检查
  typescript: {
    // 生产构建时忽略类型错误
    ignoreBuildErrors: false,
  },
  
  // ESLint 配置
  eslint: {
    // 生产构建时忽略 ESLint 错误
    ignoreDuringBuilds: false,
  },
  
  // 自定义打包分析
  ...(process.env.ANALYZE === 'true' && {
    experimental: {
      ...nextConfig.experimental,
    },
  }),
};

// 如果启用了打包分析
if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  module.exports = withBundleAnalyzer(nextConfig);
} else {
  module.exports = nextConfig;
}