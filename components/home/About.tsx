import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import {
  Code2,
  Database,
  Palette,
  Zap,
  Users,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

const skills = [
  {
    icon: Code2,
    title: '前端开发',
    description: 'React, Vue, Next.js, TypeScript',
    color: 'text-blue-500',
  },
  {
    icon: Database,
    title: '后端开发',
    description: 'Node.js, Python, Go, Rust',
    color: 'text-green-500',
  },
  {
    icon: Palette,
    title: 'UI/UX 设计',
    description: 'Figma, Tailwind CSS, 设计系统',
    color: 'text-purple-500',
  },
  {
    icon: Zap,
    title: '性能优化',
    description: '缓存策略, CDN, 代码分割',
    color: 'text-orange-500',
  },
]

const achievements = [
  '五年以上全栈开发经验',
  '参与多个大型商业项目',
  '活跃的开源贡献者',
  '技术博客写作爱好者',
]

export default function About() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 mb-4">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  关于作者
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                你好，我是白橙
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                我是一名全栈开发工程师，热爱技术创新和开源贡献。在这里，我分享技术洞察、项目经验和生活感悟，希望能帮助到更多的开发者。
              </p>
            </div>

            {/* Achievements */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                个人成就
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {achievement}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/about">
                  了解更多
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  联系我
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: Skills */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              技能领域
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skills.map((skill, index) => {
                const Icon = skill.icon
                return (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 ${skill.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {skill.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {skill.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}