/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://whiteorange.dev',
  generateRobotsTxt: true, // (可选) 生成 robots.txt
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  
  // 排除不需要的路径
  exclude: [
    '/api/*',
    '/admin/*',
    '/404',
    '/500',
    '/_next/*',
    '/private/*'
  ],
  
  // 额外的路径
  additionalPaths: async (config) => {
    return [
      await config.transform(config, '/'),
      await config.transform(config, '/about'),
      await config.transform(config, '/blog'),
    ]
  },
  
  // 自定义转换
  transform: async (config, path) => {
    // 自定义每个路径的设置
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      }
    }
    
    if (path === '/blog') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      }
    }
    
    if (path.startsWith('/blog/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }
    }
    
    // 默认设置
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    }
  },
  
  // robots.txt 额外配置
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/']
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/']
      }
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://whiteorange.dev'}/rss.xml`,
    ],
  },
}