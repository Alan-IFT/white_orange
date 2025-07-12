'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/Button'
import SearchBox from '@/components/blog/SearchBox'
import { Menu, X, Sun, Moon, Computer } from 'lucide-react'

interface NavigationItem {
  label: string
  href: string
  children?: NavigationItem[]
}

const navigation: NavigationItem[] = [
  { label: '首页', href: '/' },
  { label: '博客', href: '/blog' },
  {
    label: '分类',
    href: '/blog',
    children: [
      { label: '技术文章', href: '/blog?category=tech' },
      { label: '生活感悟', href: '/blog?category=life' },
      { label: '项目展示', href: '/blog?category=projects' },
    ],
  },
  { label: '关于', href: '/about' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light')
    } else if (theme === 'light') {
      setTheme('system')
    } else {
      setTheme('dark')
    }
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="h-4 w-4" />
      case 'light':
        return <Sun className="h-4 w-4" />
      default:
        return <Computer className="h-4 w-4" />
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">白</span>
              </div>
              <span className="hidden sm:inline-block font-bold text-xl">白橙博客</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-popover border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="hidden md:block w-64">
              <SearchBox />
            </div>

            {/* Theme Toggle */}
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {getThemeIcon()}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <nav className="py-4 space-y-2">
              {navigation.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className="block py-2 text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="ml-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}