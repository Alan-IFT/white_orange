import { getAllPosts } from '@/lib/blog'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const limit = parseInt(searchParams.get('limit') || '10')
  
  if (!query || query.trim().length === 0) {
    return NextResponse.json({ results: [], total: 0 })
  }

  try {
    const posts = await getAllPosts()
    const searchTerm = query.toLowerCase().trim()

    const results = posts.filter(post => {
      const searchableContent = [
        post.title,
        post.description,
        post.excerpt,
        ...post.categories,
        ...post.tags
      ].join(' ').toLowerCase()

      return searchableContent.includes(searchTerm)
    })

    // 按相关性排序（简单实现：标题匹配优先级更高）
    const sortedResults = results.sort((a, b) => {
      const aInTitle = a.title.toLowerCase().includes(searchTerm) ? 1 : 0
      const bInTitle = b.title.toLowerCase().includes(searchTerm) ? 1 : 0
      
      if (aInTitle !== bInTitle) {
        return bInTitle - aInTitle
      }
      
      // 按日期排序
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    const paginatedResults = sortedResults.slice(0, limit)

    return NextResponse.json({
      results: paginatedResults.map(post => ({
        slug: post.slug,
        title: post.title,
        description: post.description,
        excerpt: post.excerpt,
        date: post.date,
        categories: post.categories,
        tags: post.tags,
        readTime: post.readTime
      })),
      total: sortedResults.length,
      query: query
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Search error:', error)
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}