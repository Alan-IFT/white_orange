import { getAllPosts } from '@/lib/blog'
import { NextResponse } from 'next/server'

export async function GET() {
  const posts = await getAllPosts()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'My Blog'
  const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A modern blog built with Next.js'
  const authorName = process.env.NEXT_PUBLIC_AUTHOR_NAME || 'Blog Author'
  const authorEmail = process.env.NEXT_PUBLIC_AUTHOR_EMAIL || 'author@example.com'

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteName}</title>
    <description>${siteDescription}</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <language>zh-CN</language>
    <managingEditor>${authorEmail} (${authorName})</managingEditor>
    <webMaster>${authorEmail} (${authorName})</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Next.js RSS Generator</generator>
    ${posts
      .slice(0, 20) // 只显示最新的20篇文章
      .map(post => {
        const postUrl = `${siteUrl}/blog/${post.slug}`
        const pubDate = new Date(post.date).toUTCString()
        
        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${authorEmail} (${post.author})</author>
      ${post.categories.map(cat => `<category><![CDATA[${cat}]]></category>`).join('')}
    </item>`
      })
      .join('')}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}