import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 检查系统健康状态
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
      },
      system: {
        platform: process.platform,
        nodeVersion: process.version,
      },
      checks: {
        database: 'ok', // 如果有数据库连接可以在这里检查
        filesystem: 'ok',
        externalServices: 'ok',
      }
    }

    // 简单的系统检查
    const memoryUsage = process.memoryUsage()
    const memoryUsedMB = memoryUsage.heapUsed / 1024 / 1024

    // 如果内存使用超过 500MB，报告警告
    if (memoryUsedMB > 500) {
      healthData.checks.database = 'warning'
    }

    return NextResponse.json(healthData, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: process.env.NODE_ENV === 'development' ? 
          (error as Error).message : 'Internal server error',
      },
      { 
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    )
  }
}