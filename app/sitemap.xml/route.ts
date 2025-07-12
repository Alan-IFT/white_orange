import { getAllPosts, getAllCategories, getAllTags } from '@/lib/blog'
import { NextResponse } from 'next/server'

export async function GET() {
  const posts = await getAllPosts()
  const categories = await getAllCategories()
  const tags = await getAllTags()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const staticPages = [
    {
      url: siteUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      url: `${siteUrl}/blog`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      url: `${siteUrl}/about`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.7'
    }
  ]

  const blogPages = posts.map(post => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastmod: new Date(post.date).toISOString(),
    changefreq: 'monthly',
    priority: '0.8'
  }))

  const categoryPages = categories.map(category => ({
    url: `${siteUrl}/blog?category=${encodeURIComponent(category.name)}`,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: '0.6'
  }))

  const tagPages = tags.map(tag => ({
    url: `${siteUrl}/blog?tag=${encodeURIComponent(tag.name)}`,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: '0.5'
  }))

  const allPages = [...staticPages, ...blogPages, ...categoryPages, ...tagPages]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
    .map(page => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
    .join('')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}