import Link from 'next/link'
import { getAllPostSlugs, getPostBySlug } from '@/lib/blog'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ArticleNavigationProps {
  currentSlug: string
}

export default async function ArticleNavigation({ currentSlug }: ArticleNavigationProps) {
  const allSlugs = getAllPostSlugs()
  const currentIndex = allSlugs.indexOf(currentSlug)
  
  const prevSlug = currentIndex > 0 ? allSlugs[currentIndex - 1] : null
  const nextSlug = currentIndex < allSlugs.length - 1 ? allSlugs[currentIndex + 1] : null
  
  const [prevPost, nextPost] = await Promise.all([
    prevSlug ? getPostBySlug(prevSlug) : null,
    nextSlug ? getPostBySlug(nextSlug) : null,
  ])
  
  
  return (
    <div className="space-y-6">
      
      {/* 上下篇文章 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 上一篇 */}
        <div className="md:col-span-1">
          {prevPost ? (
            <Link href={`/blog/${prevSlug}`}>
              <div className="group p-4 border rounded-lg hover:shadow-md transition-all duration-200 hover:border-primary">
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span>上一篇</span>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                  {prevPost.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {prevPost.description}
                </p>
              </div>
            </Link>
          ) : (
            <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="text-sm text-gray-400 dark:text-gray-500">
                没有更早的文章了
              </div>
            </div>
          )}
        </div>
        
        {/* 下一篇 */}
        <div className="md:col-span-1">
          {nextPost ? (
            <Link href={`/blog/${nextSlug}`}>
              <div className="group p-4 border rounded-lg hover:shadow-md transition-all duration-200 hover:border-primary text-right">
                <div className="flex items-center justify-end space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>下一篇</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                  {nextPost.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {nextPost.description}
                </p>
              </div>
            </Link>
          ) : (
            <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 text-right">
              <div className="text-sm text-gray-400 dark:text-gray-500">
                没有更新的文章了
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 返回博客列表 */}
      <div className="text-center pt-6 border-t">
        <Button asChild>
          <Link href="/blog">
            返回文章列表
          </Link>
        </Button>
      </div>
    </div>
  )
}