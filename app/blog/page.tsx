import { Metadata } from 'next'
import { getAllPosts, getAllCategories, getAllTags } from '@/lib/blog'
import BlogList from '@/components/blog/BlogList'
import CategoryFilter from '@/components/blog/CategoryFilter'
import TagCloud from '@/components/blog/TagCloud'

export const metadata: Metadata = {
  title: '博客文章',
  description: '探索技术文章、开发经验和生活感悟，与你分享最新的技本洞察。',
}

interface BlogPageProps {
  searchParams: {
    category?: string
    tag?: string
    page?: string
    search?: string
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = Number(searchParams.page) || 1
  const category = searchParams.category
  const tag = searchParams.tag
  const search = searchParams.search
  
  const [allPosts, categories, tags] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
    getAllTags(),
  ])
  
  // 根据筛选条件过滤文章
  let filteredPosts = allPosts
  
  if (category) {
    filteredPosts = allPosts.filter(post => 
      post.categories.includes(category)
    )
  }
  
  if (tag) {
    filteredPosts = allPosts.filter(post => 
      post.tags.includes(tag)
    )
  }
  
  if (search) {
    const searchTerm = search.toLowerCase().trim()
    filteredPosts = filteredPosts.filter(post => {
      const searchableContent = [
        post.title,
        post.description,
        post.excerpt,
        ...post.categories,
        ...post.tags
      ].join(' ').toLowerCase()
      
      return searchableContent.includes(searchTerm)
    })
  }
  
  // 分页逻辑
  const POSTS_PER_PAGE = 6
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const startIndex = (page - 1) * POSTS_PER_PAGE
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)
  
  return (
    <div className="min-h-screen">
      {/* 页面头部 */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {search ? `搜索结果` : category ? `${category} 分类` : tag ? `${tag} 标签` : '博客文章'}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {search ? `关键词 "${search}" 的搜索结果` : '探索技术世界，分享开发经验，记录生活感悟'}
            </p>
            
            {/* 文章统计 */}
            <div className="mt-8 flex justify-center space-x-8 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {allPosts.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  篇文章
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {categories.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  个分类
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tags.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  个标签
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 主内容区域 */}
          <div className="lg:col-span-3">
            <BlogList 
              posts={paginatedPosts} 
              currentPage={page}
              totalPages={totalPages}
              category={category}
              tag={tag}
            />
          </div>
          
          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              {/* 分类筛选 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  文章分类
                </h3>
                <CategoryFilter categories={categories} currentCategory={category} />
              </div>
              
              {/* 标签云 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  热门标签
                </h3>
                <TagCloud tags={tags} currentTag={tag} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}