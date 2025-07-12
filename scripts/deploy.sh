#!/bin/bash

# 博客部署脚本
# 使用方法: ./scripts/deploy.sh [docker|pm2|static]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}✓ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

error() {
    echo -e "${RED}✗ $1${NC}"
    exit 1
}

# 检查环境
check_env() {
    log "检查环境..."
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js 未安装"
    fi
    
    # 检查 npm
    if ! command -v npm &> /dev/null; then
        error "npm 未安装"
    fi
    
    # 检查环境变量文件
    if [[ ! -f .env.local ]]; then
        warning ".env.local 文件不存在，请先复制并配置 .env.local.example"
        cp .env.local.example .env.local
        echo "请编辑 .env.local 文件并重新运行脚本"
        exit 1
    fi
    
    success "环境检查通过"
}

# 安装依赖
install_deps() {
    log "安装依赖..."
    npm ci
    success "依赖安装完成"
}

# 构建项目
build_project() {
    local mode=$1
    log "构建项目 (模式: $mode)..."
    
    case $mode in
        "static")
            npm run build:static
            ;;
        "server")
            npm run build:server
            ;;
        *)
            npm run build
            ;;
    esac
    
    success "构建完成"
}

# Docker 部署
deploy_docker() {
    log "使用 Docker 部署..."
    
    # 检查 Docker
    if ! command -v docker &> /dev/null; then
        error "Docker 未安装"
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose 未安装"
    fi
    
    # 停止现有容器
    log "停止现有容器..."
    docker-compose down
    
    # 构建镜像
    log "构建 Docker 镜像..."
    docker-compose build
    
    # 启动服务
    log "启动服务..."
    docker-compose up -d
    
    # 检查状态
    sleep 5
    docker-compose ps
    
    success "Docker 部署完成"
}

# PM2 部署
deploy_pm2() {
    log "使用 PM2 部署..."
    
    # 检查 PM2
    if ! command -v pm2 &> /dev/null; then
        error "PM2 未安装，请运行: npm install -g pm2"
    fi
    
    # 构建项目
    build_project "server"
    
    # 停止现有进程
    log "停止现有进程..."
    pm2 stop ecosystem.config.js || true
    
    # 启动新进程
    log "启动新进程..."
    pm2 start ecosystem.config.js
    
    # 保存配置
    pm2 save
    
    success "PM2 部署完成"
}

# 静态部署
deploy_static() {
    log "构建静态站点..."
    
    # 构建静态文件
    build_project "static"
    
    # 复制到部署目录
    if [[ -n "$DEPLOY_DIR" ]]; then
        log "复制文件到 $DEPLOY_DIR..."
        rsync -av --delete out/ "$DEPLOY_DIR/"
        success "静态文件部署完成"
    else
        success "静态文件构建完成，输出目录: ./out"
    fi
}

# 备份
backup() {
    log "创建备份..."
    
    local backup_dir="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"
    
    # 备份内容
    if [[ -d content ]]; then
        cp -r content "$backup_dir/"
    fi
    
    # 备份配置
    if [[ -f .env.local ]]; then
        cp .env.local "$backup_dir/"
    fi
    
    success "备份完成: $backup_dir"
}

# 健康检查
health_check() {
    log "执行健康检查..."
    
    local url="${NEXT_PUBLIC_SITE_URL:-http://localhost:3000}"
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
            success "健康检查通过"
            return 0
        fi
        
        log "等待服务启动... ($attempt/$max_attempts)"
        sleep 2
        ((attempt++))
    done
    
    error "健康检查失败"
}

# 显示帮助
show_help() {
    echo "博客部署脚本"
    echo ""
    echo "使用方法:"
    echo "  ./scripts/deploy.sh [选项]"
    echo ""
    echo "选项:"
    echo "  docker     使用 Docker 部署"
    echo "  pm2        使用 PM2 部署"
    echo "  static     构建静态站点"
    echo "  backup     创建备份"
    echo "  health     健康检查"
    echo "  help       显示帮助"
    echo ""
    echo "环境变量:"
    echo "  DEPLOY_DIR   静态文件部署目录"
    echo ""
    echo "示例:"
    echo "  ./scripts/deploy.sh docker"
    echo "  ./scripts/deploy.sh pm2"
    echo "  DEPLOY_DIR=/var/www/html ./scripts/deploy.sh static"
}

# 主函数
main() {
    local command=${1:-help}
    
    case $command in
        "docker")
            check_env
            install_deps
            backup
            deploy_docker
            health_check
            ;;
        "pm2")
            check_env
            install_deps
            backup
            deploy_pm2
            health_check
            ;;
        "static")
            check_env
            install_deps
            backup
            deploy_static
            ;;
        "backup")
            backup
            ;;
        "health")
            health_check
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# 运行主函数
main "$@"