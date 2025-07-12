import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'

interface Category {
  name: string
  count: number
}

interface CategoryFilterProps {
  categories: Category[]
  currentCategory?: string | undefined
}

export default function CategoryFilter({ categories, currentCategory }: CategoryFilterProps) {
  return (
    <div className="space-y-2">
      <Link
        href="/blog"
        className={`block px-3 py-2 rounded-md text-sm transition-colors ${
          !currentCategory
            ? 'bg-primary text-primary-foreground'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        全部文章
      </Link>
      
      {categories.map((category) => (
        <Link
          key={category.name}
          href={`/blog?category=${encodeURIComponent(category.name)}`}
          className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
            currentCategory === category.name
              ? 'bg-primary text-primary-foreground'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <span>{category.name}</span>
          <Badge variant="secondary" className="text-xs">
            {category.count}
          </Badge>
        </Link>
      ))}
    </div>
  )
}