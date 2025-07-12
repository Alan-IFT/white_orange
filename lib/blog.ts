import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { rehype } from 'rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import readingTime from 'reading-time'
import { generateExcerpt } from './utils'

// 类型定义
export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  categories: string[]
  tags: string[]
  author: string
  draft: boolean
  featured: boolean
  cover?: string
  content: string
  excerpt: string
  readTime: string
  wordCount: number
}

export interface BlogMetadata {
  slug: string
  title: string
  description: string
  date: string
  categories: string[]
  tags: string[]
  author: string
  draft: boolean
  featured: boolean
  cover?: string
  excerpt: string
  readTime: string
  wordCount: number
}

const contentDirectory = path.join(process.cwd(), 'content')

/**
 * 获取所有文章文件路径
 */
export function getAllPostSlugs(): string[] {
  const getAllFiles = (dir: string): string[] => {
    const items = fs.readdirSync(dir)
    let files: string[] = []
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        files = files.concat(getAllFiles(fullPath))
      } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
        const relativePath = path.relative(contentDirectory, fullPath)
        const slug = relativePath.replace(/\.(md|mdx)$/, '').replace(/\\/g, '/')
        files.push(slug)
      }
    }
    
    return files
  }
  
  if (!fs.existsSync(contentDirectory)) {
    return []
  }
  
  return getAllFiles(contentDirectory)
}

/**
 * 根据slug获取文章内容
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    // 处理 Markdown 内容
    const processedContent = await processMarkdown(content)
    
    // 计算阅读时间和字数
    const stats = readingTime(content)
    const excerpt = generateExcerpt(content)
    
    return {
      slug,
      title: data.title || '无标题',
      description: data.description || excerpt,
      date: data.date || new Date().toISOString(),
      categories: Array.isArray(data.categories) ? data.categories : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      author: data.author || '白橙',
      draft: Boolean(data.draft),
      featured: Boolean(data.featured),
      cover: data.cover,
      content: processedContent,
      excerpt,
      readTime: stats.text,
      wordCount: stats.words,
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error reading post ${slug}:`, error)
    }
    return null
  }
}

/**
 * 获取所有文章元数据
 */
export async function getAllPosts(): Promise<BlogMetadata[]> {
  const slugs = getAllPostSlugs()
  const posts: BlogMetadata[] = []
  
  for (const slug of slugs) {
    const post = await getPostBySlug(slug)
    if (post && !post.draft) {
      const { content: _, ...metadata } = post
      posts.push(metadata)
    }
  }
  
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * 获取精选文章
 */
export async function getFeaturedPosts(limit: number = 3): Promise<BlogMetadata[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter(post => post.featured).slice(0, limit)
}

/**
 * 获取最新文章
 */
export async function getRecentPosts(limit: number = 6): Promise<BlogMetadata[]> {
  const allPosts = await getAllPosts()
  return allPosts.slice(0, limit)
}

/**
 * 根据分类获取文章
 */
export async function getPostsByCategory(category: string): Promise<BlogMetadata[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter(post => post.categories.includes(category))
}

/**
 * 根据标签获取文章
 */
export async function getPostsByTag(tag: string): Promise<BlogMetadata[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter(post => post.tags.includes(tag))
}

/**
 * 获取所有分类
 */
export async function getAllCategories(): Promise<{ name: string; count: number }[]> {
  const allPosts = await getAllPosts()
  const categoryCount: Record<string, number> = {}
  
  allPosts.forEach(post => {
    post.categories.forEach(category => {
      categoryCount[category] = (categoryCount[category] || 0) + 1
    })
  })
  
  return Object.entries(categoryCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

/**
 * 获取所有标签
 */
export async function getAllTags(): Promise<{ name: string; count: number }[]> {
  const allPosts = await getAllPosts()
  const tagCount: Record<string, number> = {}
  
  allPosts.forEach(post => {
    post.tags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1
    })
  })
  
  return Object.entries(tagCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

/**
 * 处理 Markdown 内容
 */
export async function processMarkdown(content: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkMath)
    .process(content)
  
  const htmlResult = await rehype()
    .use(rehypeHighlight)
    .use(rehypeKatex)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .process(result.toString())
  
  return htmlResult.toString()
}

/**
 * 搜索文章
 */
export async function searchPosts(query: string): Promise<BlogMetadata[]> {
  const allPosts = await getAllPosts()
  const searchTerm = query.toLowerCase()
  
  return allPosts.filter(post => {
    return (
      post.title.toLowerCase().includes(searchTerm) ||
      post.description.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.categories.some(cat => cat.toLowerCase().includes(searchTerm)) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  })
}

/**
 * 分页处理
 */
export function paginatePosts<T>(posts: T[], page: number = 1, limit: number = 10) {
  const total = posts.length
  const totalPages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  
  return {
    posts: posts.slice(startIndex, endIndex),
    pagination: {
      current: page,
      total: totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    },
  }
}