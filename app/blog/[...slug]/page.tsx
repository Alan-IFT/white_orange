import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPostSlugs } from '@/lib/blog'
import ArticleContent from '@/components/blog/ArticleContent'
import ArticleMeta from '@/components/blog/ArticleMeta'
import ArticleNavigation from '@/components/blog/ArticleNavigation'

interface BlogPostPageProps {
  params: {
    slug: string[]
  }
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs()
  
  return slugs.map((slug) => ({
    slug: slug.split('/'),
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const slug = params.slug.join('/')
  const post = await getPostBySlug(slug)
  
  if (!post) {
    return {
      title: '文章未找到',
    }
  }

  // 生成动态 OG 图片 URL
  const ogImageUrl = new URL('/api/og', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
  ogImageUrl.searchParams.set('title', post.title)
  ogImageUrl.searchParams.set('description', post.description)
  if (post.categories.length > 0 && post.categories[0]) {
    ogImageUrl.searchParams.set('category', post.categories[0])
  }
  
  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: post.cover || ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.cover || ogImageUrl.toString()],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const slug = params.slug.join('/')
  const post = await getPostBySlug(slug)
  
  if (!post) {
    notFound()
  }
  
  // 结构化数据
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: '白橙博客',
      logo: {
        '@type': 'ImageObject',
        url: '/logo.png',
      },
    },
    datePublished: post.date,
    dateModified: post.date,
    image: post.cover,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://whiteorange.dev/blog/${slug}`,
    },
  }
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <article className="min-h-screen">
        {/* 文章头部 */}
        <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <ArticleMeta post={post} />
            </div>
          </div>
        </div>
        
        {/* 文章内容 */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* 主内容 */}
              <div className="lg:col-span-3">
                <ArticleContent post={post} />
              </div>
              
              {/* 侧边栏 */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* 文章信息 */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      文章信息
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>发布日期</span>
                        <span>{new Date(post.date).toLocaleDateString('zh-CN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>阅读时间</span>
                        <span>{post.readTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>字数统计</span>
                        <span>{post.wordCount} 字</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 分类和标签 */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      分类标签
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          分类
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {post.categories.map((category) => (
                            <span
                              key={category}
                              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          标签
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 文章导航 */}
            <div className="mt-12 pt-8 border-t">
              <ArticleNavigation currentSlug={slug} />
            </div>
          </div>
        </div>
      </article>
    </>
  )
}