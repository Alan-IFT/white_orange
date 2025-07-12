import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')
  const width = searchParams.get('w')

  if (!imageUrl) {
    return new NextResponse('Missing image URL', { status: 400 })
  }

  // 验证 URL 是否来自允许的域名
  const allowedDomains = [
    'images.unsplash.com',
    'cdn.pixabay.com',
    'images.pexels.com',
    'r2.cloudflarestorage.com',
    // 添加其他允许的图片域名
  ]

  try {
    const url = new URL(imageUrl)
    const isAllowed = allowedDomains.some(domain => 
      url.hostname === domain || url.hostname.endsWith(`.${domain}`)
    )

    if (!isAllowed) {
      return new NextResponse('Domain not allowed', { status: 403 })
    }

    // 获取原始图片
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'WhiteOrangeBlog/1.0 (Image Proxy)',
      },
    })

    if (!response.ok) {
      return new NextResponse('Failed to fetch image', { status: response.status })
    }

    const contentType = response.headers.get('content-type')
    
    // 验证是否为图片类型
    if (!contentType || !contentType.startsWith('image/')) {
      return new NextResponse('Not an image', { status: 400 })
    }

    const buffer = await response.arrayBuffer()

    // 设置缓存头部
    const headers = new Headers()
    headers.set('Content-Type', contentType)
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    headers.set('X-Image-Proxy', 'true')

    // 如果有 width 参数，这里可以集成图片缩放逻辑
    // 现在只是简单代理
    if (width) {
      headers.set('X-Requested-Width', width)
    }

    return new NextResponse(buffer, {
      status: 200,
      headers,
    })

  } catch (error) {
    console.error('Image proxy error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}