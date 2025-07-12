import { BlogPost } from '@/lib/blog'
import { Badge } from '@/components/ui/Badge'
import { Calendar, Clock, User } from 'lucide-react'

interface ArticleMetaProps {
  post: BlogPost
}

export default function ArticleMeta({ post }: ArticleMetaProps) {
  return (
    <div className="space-y-6">
      {/* 文章标题 */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
        {post.title}
      </h1>
      
      {/* 文章描述 */}
      <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
        {post.description}
      </p>
      
      {/* 分类和标签 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {post.categories.map((category) => (
          <Badge key={category} className="text-sm px-3 py-1">
            {category}
          </Badge>
        ))}
        {post.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="text-sm px-3 py-1">
            {tag}
          </Badge>
        ))}
      </div>
      
      {/* 文章元信息 */}
      <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span className="text-sm">{post.author}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">
            {new Date(post.date).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{post.readTime}</span>
        </div>
        {post.featured && (
          <Badge variant="secondary" className="text-xs">
            精选文章
          </Badge>
        )}
      </div>
    </div>
  )
}