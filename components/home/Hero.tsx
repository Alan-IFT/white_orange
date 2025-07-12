import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Code, Heart, Lightbulb } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative container mx-auto px-4 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            欢迎来到
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              白橙博客
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            分享前端技术、后端开发和生活感悟，探索技术世界的无限可能
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Code className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium">技术分享</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Lightbulb className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">创新思维</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Heart className="h-5 w-5 text-pink-500" />
              <span className="text-sm font-medium">生活感悟</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-base px-8">
              <Link href="/tech">
                浏览技术文章
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base px-8">
              <Link href="/about">
                了解更多
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                100+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                技术文章
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                50+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                项目实战
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                10K+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                读者关注
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}