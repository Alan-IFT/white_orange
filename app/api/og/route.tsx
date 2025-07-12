import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const interSemiBold = fetch(
  new URL('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2')
).then((res) => res.arrayBuffer())

const interRegular = fetch(
  new URL('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeAZ9hiA.woff2')
).then((res) => res.arrayBuffer())

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // 获取参数
    const title = searchParams.get('title') || '白橙博客'
    const description = searchParams.get('description') || '分享技术见解与生活感悟的个人博客'
    const category = searchParams.get('category') || ''
    
    const [fontSemiBold, fontRegular] = await Promise.all([
      interSemiBold,
      interRegular,
    ])

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontSize: 32,
            fontWeight: 600,
            color: 'white',
            padding: '80px',
            position: 'relative',
          }}
        >
          {/* 背景装饰 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              opacity: 0.9,
            }}
          />
          
          {/* Logo 区域 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                background: '#f97316',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '20px',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '40px',
                  background: 'white',
                  borderRadius: '4px',
                  marginRight: '8px',
                }}
              />
              <div
                style={{
                  width: '20px',
                  height: '40px',
                  background: '#fed7aa',
                  borderRadius: '4px',
                }}
              />
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 600,
                color: 'white',
              }}
            >
              白橙博客
            </div>
          </div>

          {/* 分类标签 */}
          {category && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '18px',
                fontWeight: 500,
                marginBottom: '20px',
                zIndex: 1,
              }}
            >
              {category}
            </div>
          )}

          {/* 标题 */}
          <div
            style={{
              fontSize: '48px',
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: '24px',
              maxWidth: '900px',
              zIndex: 1,
            }}
          >
            {title}
          </div>

          {/* 描述 */}
          <div
            style={{
              fontSize: '24px',
              fontWeight: 400,
              lineHeight: 1.4,
              opacity: 0.9,
              maxWidth: '800px',
              zIndex: 1,
            }}
          >
            {description}
          </div>

          {/* 底部信息 */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              fontSize: '18px',
              opacity: 0.8,
              zIndex: 1,
            }}
          >
            whiteorange.dev
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: fontSemiBold,
            style: 'normal',
            weight: 600,
          },
          {
            name: 'Inter',
            data: fontRegular,
            style: 'normal',
            weight: 400,
          },
        ],
      }
    )
  } catch (e: any) {
    console.error('OG image generation failed:', e.message)
    return new Response('Failed to generate the image', {
      status: 500,
    })
  }
}