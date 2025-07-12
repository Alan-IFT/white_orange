import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

export const metadata: Metadata = {
  title: '关于我',
  description: '了解更多关于我的信息、技能和经历。',
}

async function getAboutContent() {
  const aboutPath = path.join(process.cwd(), 'content', 'about.md')
  
  if (!fs.existsSync(aboutPath)) {
    return {
      title: '关于我',
      content: '<p>关于页面内容即将更新...</p>'
    }
  }

  const fileContents = fs.readFileSync(aboutPath, 'utf8')
  const { data, content } = matter(fileContents)

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content)

  return {
    title: data.title || '关于我',
    content: processedContent.toString()
  }
}

export default async function AboutPage() {
  const { title, content } = await getAboutContent()

  return (
    <div className="min-h-screen">
      {/* 页面头部 */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              个人简介、技能专长和职业经历
            </p>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div 
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-p:text-gray-700 dark:prose-p:text-gray-300
              prose-strong:text-gray-900 dark:prose-strong:text-white
              prose-code:text-blue-600 dark:prose-code:text-blue-400
              prose-pre:bg-gray-50 dark:prose-pre:bg-gray-800
              prose-blockquote:border-blue-500 
              prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  )
}