import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import FeaturedPosts from '@/components/home/FeaturedPosts'
import RecentPosts from '@/components/home/RecentPosts'
import About from '@/components/home/About'

export const metadata: Metadata = {
  title: '首页',
  description: '欢迎来到白橙博客，这里分享前端技术、后端开发和生活感悟',
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <div className="container mx-auto px-4 py-8 space-y-12">
          <FeaturedPosts />
          <RecentPosts />
          <About />
        </div>
      </main>
      <Footer />
    </>
  )
}