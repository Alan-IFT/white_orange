// PM2 配置文件
module.exports = {
  apps: [
    {
      name: 'blog',
      script: 'server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // 自动重启配置
      watch: false,
      max_memory_restart: '1G',
      
      // 错误处理
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      
      // 重启策略
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      
      // 进程管理
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 3000,
      
      // 健康检查
      health_check_grace_period: 3000,
      
      // 环境变量
      env_file: '.env.local',
      
      // 日志配置
      log_type: 'json',
      merge_logs: true,
      
      // 自动重启条件
      autorestart: true,
      
      // 忽略监听文件
      ignore_watch: [
        'node_modules',
        '.next',
        'logs',
        '.git'
      ]
    }
  ],
  
  // 部署配置
  deploy: {
    production: {
      user: 'node',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'https://github.com/yourusername/blog.git',
      path: '/var/www/blog',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build:server && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};