'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'

interface SearchResult {
  slug: string
  title: string
  description: string
  excerpt: string
  date: string
  categories: string[]
  tags: string[]
  readTime: string
}

interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
}

export default function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [total, setTotal] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length > 0) {
        performSearch(query)
      } else {
        setResults([])
        setTotal(0)
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=5`)
      const data: SearchResponse = await response.json()
      setResults(data.results)
      setTotal(data.total)
      setIsOpen(true)
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
      setTotal(0)
    } finally {
      setIsLoading(false)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setTotal(0)
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleResultClick = () => {
    setIsOpen(false)
    setQuery('')
    setResults([])
  }

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="搜索文章..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
          onFocus={() => {
            if (results.length > 0) setIsOpen(true)
          }}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (query.length > 0) && (
        <Card className="absolute top-full mt-2 w-full z-50 shadow-lg border bg-white dark:bg-gray-800">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                搜索中...
              </div>
            ) : results.length > 0 ? (
              <div>
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    找到 {total} 篇文章
                  </span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {results.map((result) => (
                    <Link
                      key={result.slug}
                      href={`/blog/${result.slug}`}
                      onClick={handleResultClick}
                      className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">
                        {result.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {result.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                        <span>{new Date(result.date).toLocaleDateString('zh-CN')}</span>
                        <span>•</span>
                        <span>{result.readTime}</span>
                        <span>•</span>
                        <div className="flex gap-1">
                          {result.categories.slice(0, 2).map((category) => (
                            <Badge key={category} variant="secondary" className="text-xs px-1 py-0">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                {total > 5 && (
                  <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                    <Link
                      href={`/blog?search=${encodeURIComponent(query)}`}
                      onClick={handleResultClick}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      查看全部 {total} 个结果
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                没有找到相关文章
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}