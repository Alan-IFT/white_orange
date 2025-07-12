import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Calendar, Clock, ArrowRight, Bookmark } from 'lucide-react'
import { getRecentPosts } from '@/lib/blog'

export default async function RecentPosts() {
  const recentPosts = await getRecentPosts(6)

  return (
    <section className="py-16">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center space-x-2 mb-4">
              <Bookmark className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                最新更新
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              最新文章
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              最新发布的技术文章和生活分享
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/blog">
              查看全部
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {recentPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            暂无文章，敬请期待...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post, index) => (
            <Card
              key={post.slug}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {post.categories[0] || '文章'}
                  </Badge>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.date).toLocaleDateString('zh-CN')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-3 text-sm">
                  {post.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  阅读全文
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}