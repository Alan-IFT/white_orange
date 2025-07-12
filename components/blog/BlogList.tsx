import Link from 'next/link'
import { BlogMetadata } from '@/lib/blog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

interface BlogListProps {
  posts: BlogMetadata[]
  currentPage?: number
  totalPages?: number
  category?: string | undefined
  tag?: string | undefined
}

export default function BlogList({ posts, currentPage = 1, totalPages = 1, category, tag }: BlogListProps) {
  const buildUrl = (page: number) => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (tag) params.set('tag', tag)
    if (page > 1) params.set('page', page.toString())
    return `/blog${params.toString() ? `?${params.toString()}` : ''}`
  }
  
  return (
    <div className="space-y-8">
      {/* 筛选信息 */}
      {(category || tag) && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>当前显示:</span>
          {category && (
            <Badge variant="outline">分类: {category}</Badge>
          )}
          {tag && (
            <Badge variant="outline">标签: {tag}</Badge>
          )}
          <span className="ml-2">共 {posts.length} 篇文章</span>
        </div>
      )}
      
      {/* 文章列表 */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            没有找到相关文章
          </div>
          <p className="text-gray-400 dark:text-gray-500">
            试试更改筛选条件或查看其他分类
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Card
              key={post.slug}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
            >
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map((cat) => (
                      <Badge key={cat} variant="secondary" className="text-xs">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                  {post.featured && (
                    <Badge className="text-xs">精选</Badge>
                  )}
                </div>
                
                <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </CardTitle>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(post.date).toLocaleDateString('zh-CN')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow flex flex-col">
                <CardDescription className="line-clamp-3 flex-grow mb-4">
                  {post.description}
                </CardDescription>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {post.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{post.tags.length - 3}
                    </Badge>
                  )}
                </div>
                
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline mt-auto"
                >
                  阅读全文
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-12">
          {currentPage > 1 && (
            <Button asChild variant="outline">
              <Link href={buildUrl(currentPage - 1)}>
                上一页
              </Link>
            </Button>
          )}
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                asChild
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
              >
                <Link href={buildUrl(page)}>
                  {page}
                </Link>
              </Button>
            ))}
          </div>
          
          {currentPage < totalPages && (
            <Button asChild variant="outline">
              <Link href={buildUrl(currentPage + 1)}>
                下一页
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}