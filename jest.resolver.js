/**
 * Jest 自定义解析器 - Next.js 15.3.5+ 兼容
 * 处理模块解析和路径映射
 */

const { createRequire } = require('module')
const { resolve } = require('path')

module.exports = (request, options) => {
  // 处理 React 19 和相关依赖的解析
  if (request === 'react' || request === 'react-dom') {
    return options.defaultResolver(request, {
      ...options,
      packageFilter: (pkg) => {
        // 确保使用正确的 React 19 版本
        if (pkg.name === 'react' || pkg.name === 'react-dom') {
          pkg.main = pkg.main || 'index.js'
        }
        return pkg
      },
    })
  }

  // 处理 ES 模块
  if (request.includes('node_modules')) {
    const esmModules = [
      'framer-motion',
      'lucide-react',
      'next-themes',
      'cmdk',
      'zustand',
    ]
    
    const isESM = esmModules.some(module => request.includes(module))
    if (isESM) {
      return options.defaultResolver(request, {
        ...options,
        packageFilter: (pkg) => {
          if (pkg.module) {
            pkg.main = pkg.module
          }
          return pkg
        },
      })
    }
  }

  // 处理路径映射
  const pathMappings = {
    '^@/(.*)$': resolve(options.rootDir, '$1'),
    '^@/components/(.*)$': resolve(options.rootDir, 'components', '$1'),
    '^@/lib/(.*)$': resolve(options.rootDir, 'lib', '$1'),
    '^@/app/(.*)$': resolve(options.rootDir, 'app', '$1'),
    '^@/content/(.*)$': resolve(options.rootDir, 'content', '$1'),
    '^@/public/(.*)$': resolve(options.rootDir, 'public', '$1'),
  }

  for (const [pattern, replacement] of Object.entries(pathMappings)) {
    const regex = new RegExp(pattern)
    if (regex.test(request)) {
      const resolvedPath = request.replace(regex, replacement)
      try {
        return options.defaultResolver(resolvedPath, options)
      } catch (error) {
        // 如果解析失败，继续使用默认解析器
        break
      }
    }
  }

  // 默认解析
  return options.defaultResolver(request, options)
}