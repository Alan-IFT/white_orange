import Link from 'next/link'
import { Github, Twitter, Mail, Rss } from 'lucide-react'

const footerLinks = {
  博客: [
    { label: '所有文章', href: '/blog' },
    { label: '技术文章', href: '/blog?category=tech' },
    { label: '生活感悟', href: '/blog?category=life' },
    { label: '项目展示', href: '/blog?category=projects' },
  ],
  其他: [
    { label: '关于', href: '/about' },
    { label: '站点地图', href: '/sitemap.xml' },
    { label: 'RSS 订阅', href: '/rss.xml' },
  ],
}

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com',
    icon: Github,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com',
    icon: Twitter,
  },
  {
    name: 'Email',
    href: 'mailto:contact@example.com',
    icon: Mail,
  },
  {
    name: 'RSS',
    href: '/feed.xml',
    icon: Rss,
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">白</span>
              </div>
              <span className="font-bold text-xl">白橙博客</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              分享前端技术、后端开发和生活感悟，探索技术世界的无限可能。
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={link.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {currentYear} 白橙博客. 保留所有权利。
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                隐私政策
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                使用条款
              </Link>
              <span className="text-xs">
                Powered by{' '}
                <a
                  href="https://nextjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Next.js
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}