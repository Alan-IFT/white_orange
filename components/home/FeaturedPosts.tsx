import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Calendar, Clock, ArrowRight, Star } from 'lucide-react'
import { getFeaturedPosts } from '@/lib/blog'

export default async function FeaturedPosts() {
  const featuredPosts = await getFeaturedPosts(3)

  return (
    <section className="py-16">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center space-x-2 mb-4">
          <Star className="h-5 w-5 text-orange-500" />
          <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
            精选推荐
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          热门文章
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          精心挑选的技术文章，帮助你提升技能和解决实际问题
        </p>
      </div>

      {featuredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            暂无精选文章，敬请期待...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post, index) => (
            <Card
              key={post.slug}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-fade-in"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="relative overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-orange-100 to-blue-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                  <div className="text-4xl font-bold text-gray-400 dark:text-gray-500">
                    {post.categories[0]?.charAt(0) || '📝'}
                  </div>
                </div>
                <Badge className="absolute top-3 left-3" variant="secondary">
                  {post.categories[0] || '文章'}
                </Badge>
              </div>

              <CardHeader>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.date).toLocaleDateString('zh-CN')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button asChild variant="ghost" className="w-full justify-between p-0 h-auto">
                  <Link href={`/blog/${post.slug}`} className="flex items-center justify-between p-3 hover:bg-accent rounded-md transition-colors">
                    <span>阅读全文</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <Button asChild size="lg">
          <Link href="/blog">
            查看更多技术文章
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}