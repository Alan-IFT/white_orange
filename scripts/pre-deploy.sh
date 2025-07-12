#!/bin/bash

# 部署前验证脚本 - 确保应用程序准备就绪
# 适用于 Next.js 15.3.5+ & React 19.1.0+ 博客系统

set -euo pipefail

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 错误处理
handle_error() {
    log_error "部署前验证失败，脚本在第 $1 行退出"
    log_error "请检查上述错误信息并修复问题后重试"
    exit 1
}

trap 'handle_error $LINENO' ERR

# 显示脚本开始信息
echo "========================================"
echo "      博客系统部署前验证"
echo "========================================"
echo ""

# 检查必需的工具
log_info "检查必需的工具..."

command -v node >/dev/null 2>&1 || { log_error "Node.js 未安装"; exit 1; }
command -v npm >/dev/null 2>&1 || { log_error "npm 未安装"; exit 1; }
command -v git >/dev/null 2>&1 || { log_error "Git 未安装"; exit 1; }

# 检查 Node.js 版本
NODE_VERSION=$(node --version | sed 's/v//')
REQUIRED_NODE_VERSION="22.17.0"

if ! dpkg --compare-versions "$NODE_VERSION" "ge" "$REQUIRED_NODE_VERSION"; then
    log_error "Node.js 版本过低。当前: $NODE_VERSION, 需要: >= $REQUIRED_NODE_VERSION"
    exit 1
fi

log_success "Node.js 版本检查通过: $NODE_VERSION"

# 检查 npm 版本
NPM_VERSION=$(npm --version)
REQUIRED_NPM_VERSION="10.9.2"

if ! dpkg --compare-versions "$NPM_VERSION" "ge" "$REQUIRED_NPM_VERSION"; then
    log_warning "npm 版本可能过低。当前: $NPM_VERSION, 推荐: >= $REQUIRED_NPM_VERSION"
else
    log_success "npm 版本检查通过: $NPM_VERSION"
fi

# 检查项目根目录
if [ ! -f "package.json" ]; then
    log_error "未找到 package.json 文件，请确保在项目根目录运行此脚本"
    exit 1
fi

log_success "项目根目录验证通过"

# 检查环境变量
log_info "检查必需的环境变量..."

required_env_vars=(
    "NEXT_PUBLIC_SITE_NAME"
    "NEXT_PUBLIC_SITE_DESCRIPTION"
    "NEXT_PUBLIC_SITE_URL"
    "NEXT_PUBLIC_AUTHOR_NAME"
    "NEXT_PUBLIC_AUTHOR_EMAIL"
)

missing_vars=()

for var in "${required_env_vars[@]}"; do
    if [ -z "${!var:-}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    log_error "缺少必需的环境变量:"
    for var in "${missing_vars[@]}"; do
        log_error "  - $var"
    done
    log_error "请设置这些环境变量或在 .env.local 文件中配置"
    exit 1
fi

log_success "环境变量检查通过"

# 检查依赖项
log_info "检查项目依赖..."

if [ ! -d "node_modules" ]; then
    log_info "安装项目依赖..."
    npm ci
fi

# 验证关键依赖版本
check_dependency_version() {
    local package=$1
    local required_version=$2
    local current_version
    
    if npm list "$package" >/dev/null 2>&1; then
        current_version=$(npm list "$package" --depth=0 2>/dev/null | grep "$package" | sed 's/.*@//' | sed 's/ .*//')
        log_success "$package 已安装: $current_version"
        
        # 这里可以添加版本比较逻辑
        if [[ "$current_version" == *"$required_version"* ]]; then
            log_success "$package 版本符合要求"
        else
            log_warning "$package 版本可能不匹配。当前: $current_version, 期望: $required_version"
        fi
    else
        log_error "$package 未安装"
        return 1
    fi
}

# 检查关键依赖
check_dependency_version "next" "15.3.5"
check_dependency_version "react" "19.1.0"
check_dependency_version "typescript" "5.7.2"

# 安全漏洞检查
log_info "检查安全漏洞..."
if npm audit --audit-level high --json >/dev/null 2>&1; then
    log_success "安全漏洞检查通过"
else
    log_warning "发现安全漏洞，请运行 'npm audit fix' 修复"
fi

# TypeScript 类型检查
log_info "运行 TypeScript 类型检查..."
if npm run type-check; then
    log_success "TypeScript 类型检查通过"
else
    log_error "TypeScript 类型检查失败"
    exit 1
fi

# ESLint 检查
log_info "运行 ESLint 检查..."
if npm run lint; then
    log_success "ESLint 检查通过"
else
    log_error "ESLint 检查失败"
    exit 1
fi

# Prettier 格式检查
log_info "运行 Prettier 格式检查..."
if npm run format:check; then
    log_success "代码格式检查通过"
else
    log_warning "代码格式不符合规范，建议运行 'npm run format' 修复"
fi

# 运行单元测试
log_info "运行单元测试..."
if npm run test -- --watchAll=false --coverage=false; then
    log_success "单元测试通过"
else
    log_error "单元测试失败"
    exit 1
fi

# 构建测试
log_info "测试应用程序构建..."

# 根据输出模式选择构建方式
OUTPUT_MODE=${NEXT_OUTPUT_MODE:-"standalone"}

if [ "$OUTPUT_MODE" = "export" ]; then
    log_info "构建静态导出版本..."
    if npm run build:static; then
        log_success "静态构建成功"
        
        # 检查输出文件
        if [ ! -d "out" ] || [ ! -f "out/index.html" ]; then
            log_error "静态构建输出不完整"
            exit 1
        fi
        
        log_success "静态构建输出验证通过"
    else
        log_error "静态构建失败"
        exit 1
    fi
else
    log_info "构建服务器版本..."
    if npm run build:server; then
        log_success "服务器构建成功"
        
        # 检查输出文件
        if [ ! -d ".next/standalone" ]; then
            log_error "服务器构建输出不完整"
            exit 1
        fi
        
        log_success "服务器构建输出验证通过"
    else
        log_error "服务器构建失败"
        exit 1
    fi
fi

# 检查构建文件大小
log_info "检查构建文件大小..."

if [ "$OUTPUT_MODE" = "export" ]; then
    BUILD_SIZE=$(du -sh out 2>/dev/null | cut -f1 || echo "unknown")
    log_info "静态构建大小: $BUILD_SIZE"
else
    BUILD_SIZE=$(du -sh .next 2>/dev/null | cut -f1 || echo "unknown")
    log_info "服务器构建大小: $BUILD_SIZE"
fi

# 检查重要文件是否存在
log_info "检查重要文件..."

important_files=(
    "package.json"
    "next.config.js"
    "tsconfig.json"
    ".eslintrc.js"
    "prettier.config.js"
    "tailwind.config.js"
    "site.config.ts"
)

for file in "${important_files[@]}"; do
    if [ -f "$file" ]; then
        log_success "✓ $file"
    else
        log_warning "✗ $file (可选)"
    fi
done

# 检查内容目录
if [ -d "content" ]; then
    CONTENT_COUNT=$(find content -name "*.md" -o -name "*.mdx" | wc -l)
    log_info "找到 $CONTENT_COUNT 个内容文件"
    
    if [ "$CONTENT_COUNT" -eq 0 ]; then
        log_warning "content 目录为空，请添加博客文章"
    fi
else
    log_warning "未找到 content 目录"
fi

# 检查 Docker 配置（如果存在）
if [ -f "Dockerfile" ]; then
    log_info "检查 Docker 配置..."
    
    if command -v docker >/dev/null 2>&1; then
        # 简单的 Dockerfile 语法检查
        if docker build --dry-run . >/dev/null 2>&1; then
            log_success "Dockerfile 语法检查通过"
        else
            log_warning "Dockerfile 可能存在问题"
        fi
    else
        log_info "Docker 未安装，跳过 Dockerfile 检查"
    fi
fi

# Git 检查
log_info "检查 Git 状态..."

if git status >/dev/null 2>&1; then
    # 检查是否有未提交的更改
    if ! git diff-index --quiet HEAD --; then
        log_warning "存在未提交的更改"
        git status --porcelain
    else
        log_success "工作目录干净"
    fi
    
    # 检查当前分支
    CURRENT_BRANCH=$(git branch --show-current)
    log_info "当前分支: $CURRENT_BRANCH"
    
    # 检查是否与远程同步
    if git remote >/dev/null 2>&1; then
        git fetch >/dev/null 2>&1 || true
        
        if git status | grep -q "Your branch is up to date"; then
            log_success "分支与远程同步"
        else
            log_warning "分支可能不与远程同步"
        fi
    fi
else
    log_warning "不在 Git 仓库中"
fi

# 性能建议
log_info "性能检查和建议..."

# 检查是否启用了生产优化
if grep -q '"NODE_ENV": "production"' package.json 2>/dev/null; then
    log_success "生产环境配置已启用"
else
    log_info "确保在部署时设置 NODE_ENV=production"
fi

# 检查是否有 sitemap 和 robots.txt
if [ -f "public/robots.txt" ]; then
    log_success "找到 robots.txt"
else
    log_info "建议添加 robots.txt 文件"
fi

# 资源检查
log_info "检查静态资源..."

if [ -d "public" ]; then
    PUBLIC_SIZE=$(du -sh public 2>/dev/null | cut -f1 || echo "unknown")
    log_info "public 目录大小: $PUBLIC_SIZE"
    
    # 检查是否有大文件
    LARGE_FILES=$(find public -type f -size +1M 2>/dev/null | head -5)
    if [ -n "$LARGE_FILES" ]; then
        log_warning "发现大型静态文件 (>1MB):"
        echo "$LARGE_FILES" | while read -r file; do
            SIZE=$(du -h "$file" | cut -f1)
            log_warning "  $file ($SIZE)"
        done
        log_info "建议优化这些文件以提高加载速度"
    fi
fi

# 最终总结
echo ""
echo "========================================"
echo "        部署前验证完成"
echo "========================================"
echo ""

log_success "所有检查完成！应用程序已准备好部署。"

# 显示部署提示
echo ""
log_info "部署提示:"
echo "  1. 确保目标服务器满足运行要求"
echo "  2. 备份现有部署（如果有）"
echo "  3. 在部署后运行健康检查"
echo "  4. 监控应用程序日志"
echo ""

# 显示快速部署命令
log_info "快速部署命令:"
if [ "$OUTPUT_MODE" = "export" ]; then
    echo "  静态部署: ./scripts/deploy.sh static"
else
    echo "  Docker 部署: ./scripts/deploy.sh docker"
    echo "  PM2 部署: ./scripts/deploy.sh pm2"
fi

echo ""
log_success "部署前验证成功完成！🚀"