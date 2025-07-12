import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: '白橙博客 | 技术分享与生活记录',
    template: '%s | 白橙博客'
  },
  description: '专注于前端技术、后端开发、DevOps工具的技术博客，分享编程经验、项目实践和生活感悟',
  keywords: ['博客', '技术', 'Next.js', 'React', 'TypeScript', '前端开发', '后端开发'],
  authors: [{ name: '白橙', url: 'https://whiteorange.dev' }],
  creator: '白橙',
  publisher: '白橙博客',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://whiteorange.dev',
    siteName: '白橙博客',
    title: '白橙博客 | 技术分享与生活记录',
    description: '专注于前端技术、后端开发、DevOps工具的技术博客',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '白橙博客',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '白橙博客 | 技术分享与生活记录',
    description: '专注于前端技术、后端开发、DevOps工具的技术博客',
    images: ['/og-image.jpg'],
    creator: '@whiteorange',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  verification: {
    google: 'google-site-verification-code',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}