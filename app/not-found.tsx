import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - 页面未找到</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          抱歉，您访问的页面不存在。
        </p>
        <Button asChild>
          <Link href="/">
            返回首页
          </Link>
        </Button>
      </div>
    </div>
  )
}