import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'

interface Tag {
  name: string
  count: number
}

interface TagCloudProps {
  tags: Tag[]
  currentTag?: string | undefined
}

export default function TagCloud({ tags, currentTag }: TagCloudProps) {
  // 根据使用次数计算字体大小
  const getTagSize = (count: number, maxCount: number) => {
    const ratio = count / maxCount
    if (ratio > 0.8) return 'text-base'
    if (ratio > 0.6) return 'text-sm'
    if (ratio > 0.4) return 'text-sm'
    return 'text-xs'
  }
  
  const maxCount = Math.max(...tags.map(tag => tag.count))
  
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.name}
          href={`/blog?tag=${encodeURIComponent(tag.name)}`}
          className="inline-block"
        >
          <Badge
            variant={currentTag === tag.name ? "default" : "outline"}
            className={`transition-colors hover:bg-primary hover:text-primary-foreground ${
              getTagSize(tag.count, maxCount)
            }`}
          >
            {tag.name} ({tag.count})
          </Badge>
        </Link>
      ))}
    </div>
  )
}