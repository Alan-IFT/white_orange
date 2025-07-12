'use client'

import { BlogPost } from '@/lib/blog'
import { Button } from '@/components/ui/Button'
import { Share2, Heart, Bookmark } from 'lucide-react'

interface ArticleContentProps {
  post: BlogPost
}

export default function ArticleContent({ post }: ArticleContentProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('分享取消')
      }
    } else {
      // 复制链接到剪贴板
      await navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板')
    }
  }
  
  const handleLike = () => {
    // TODO: 实现点赞功能
    console.log('点赞文章')
  }
  
  const handleBookmark = () => {
    // TODO: 实现收藏功能
    console.log('收藏文章')
  }
  
  return (
    <div className="space-y-8">
      {/* 文章内容 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border">
        <div 
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
      
      {/* 文章操作 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            喜欢这篇文章吗？
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLike}
              className="flex items-center space-x-2"
            >
              <Heart className="h-4 w-4" />
              <span>点赞</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBookmark}
              className="flex items-center space-x-2"
            >
              <Bookmark className="h-4 w-4" />
              <span>收藏</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center space-x-2"
            >
              <Share2 className="h-4 w-4" />
              <span>分享</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* 作者信息 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
            白
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {post.author}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              全栈开发工程师，热爱技术创新和开源贡献。在这里分享技术洞察、项目经验和生活感悟，希望能帮助到更多的开发者。
            </p>
            <div className="mt-3 flex items-center space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Twitter
              </a>
              <a
                href="mailto:contact@example.com"
                className="text-sm text-primary hover:underline"
              >
                邮箱联系
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}