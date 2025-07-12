#!/bin/bash

# 回滚脚本 - 快速恢复到上一个稳定版本
# 适用于 Next.js 15.3.5+ & React 19.1.0+ 博客系统

set -euo pipefail

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置参数
BACKUP_DIR="/var/backups/blog"
DEPLOYMENT_MODES=("docker" "pm2" "static" "systemd")
DEFAULT_MODE="auto"

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

# 显示使用说明
show_usage() {
    echo "用法: $0 [选项] [部署模式]"
    echo ""
    echo "选项:"
    echo "  -h, --help          显示此帮助信息"
    echo "  -l, --list          列出可用的备份"
    echo "  -f, --force         强制回滚，不进行确认"
    echo "  -b, --backup-dir    指定备份目录 (默认: $BACKUP_DIR)"
    echo "  -v, --version       指定要回滚到的版本"
    echo "  -t, --test          测试模式，不执行实际回滚"
    echo ""
    echo "部署模式:"
    echo "  docker              Docker 容器部署"
    echo "  pm2                 PM2 进程管理"
    echo "  static              静态文件部署"
    echo "  systemd             Systemd 服务"
    echo "  auto                自动检测 (默认)"
    echo ""
    echo "示例:"
    echo "  $0                  # 自动检测并回滚到最新备份"
    echo "  $0 docker           # 回滚 Docker 部署"
    echo "  $0 -v v1.2.3 pm2    # 回滚到指定版本"
    echo "  $0 -l               # 列出所有可用备份"
    echo ""
}

# 解析命令行参数
FORCE_MODE=false
LIST_MODE=false
TEST_MODE=false
SPECIFIED_VERSION=""
DEPLOYMENT_MODE="$DEFAULT_MODE"

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_usage
            exit 0
            ;;
        -l|--list)
            LIST_MODE=true
            shift
            ;;
        -f|--force)
            FORCE_MODE=true
            shift
            ;;
        -b|--backup-dir)
            BACKUP_DIR="$2"
            shift 2
            ;;
        -v|--version)
            SPECIFIED_VERSION="$2"
            shift 2
            ;;
        -t|--test)
            TEST_MODE=true
            shift
            ;;
        docker|pm2|static|systemd)
            DEPLOYMENT_MODE="$1"
            shift
            ;;
        *)
            log_error "未知参数: $1"
            show_usage
            exit 1
            ;;
    esac
done

# 显示脚本开始信息
echo "========================================"
echo "        博客系统回滚工具"
echo "========================================"
echo ""

# 检查权限
if [[ $EUID -ne 0 ]] && [[ "$DEPLOYMENT_MODE" != "static" ]]; then
    log_warning "某些操作可能需要 root 权限"
fi

# 创建备份目录（如果不存在）
if [ ! -d "$BACKUP_DIR" ]; then
    log_warning "备份目录不存在: $BACKUP_DIR"
    
    if [ "$LIST_MODE" = true ]; then
        log_error "无法列出备份，备份目录不存在"
        exit 1
    fi
    
    log_info "尝试创建备份目录..."
    mkdir -p "$BACKUP_DIR" 2>/dev/null || {
        log_error "无法创建备份目录，可能需要管理员权限"
        exit 1
    }
fi

# 列出可用备份
list_backups() {
    log_info "可用的备份版本："
    echo ""
    
    if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A "$BACKUP_DIR" 2>/dev/null)" ]; then
        log_warning "未找到任何备份文件"
        echo ""
        log_info "备份文件通常在以下情况下创建："
        echo "  - 部署新版本之前"
        echo "  - 手动运行备份脚本"
        echo "  - 定期自动备份"
        echo ""
        return 1
    fi
    
    # 按时间排序显示备份
    local backup_count=0
    for backup in $(ls -t "$BACKUP_DIR"/*.tar.gz 2>/dev/null || echo ""); do
        if [ -f "$backup" ]; then
            local filename=$(basename "$backup")
            local timestamp=$(echo "$filename" | grep -o '[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}_[0-9]\{2\}-[0-9]\{2\}-[0-9]\{2\}' || echo "unknown")
            local size=$(du -h "$backup" | cut -f1)
            local date_readable
            
            if [ "$timestamp" != "unknown" ]; then
                date_readable=$(date -d "${timestamp//_/ }" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || echo "$timestamp")
            else
                date_readable=$(stat -c %y "$backup" 2>/dev/null | cut -d'.' -f1 || echo "unknown")
            fi
            
            backup_count=$((backup_count + 1))
            printf "  %2d. %s (%s) - %s\n" "$backup_count" "$filename" "$size" "$date_readable"
        fi
    done
    
    if [ $backup_count -eq 0 ]; then
        log_warning "未找到有效的备份文件"
        return 1
    fi
    
    echo ""
    log_info "找到 $backup_count 个备份文件"
    return 0
}

# 如果是列表模式，只显示备份并退出
if [ "$LIST_MODE" = true ]; then
    list_backups
    exit $?
fi

# 自动检测部署模式
detect_deployment_mode() {
    log_info "自动检测部署模式..."
    
    # 检查 Docker
    if command -v docker >/dev/null 2>&1 && docker ps --format "table {{.Names}}" | grep -q "blog\|white-orange"; then
        echo "docker"
        return 0
    fi
    
    # 检查 PM2
    if command -v pm2 >/dev/null 2>&1 && pm2 list | grep -q "blog\|white-orange"; then
        echo "pm2"
        return 0
    fi
    
    # 检查 systemd
    if systemctl is-active --quiet blog 2>/dev/null || systemctl is-active --quiet white-orange-blog 2>/dev/null; then
        echo "systemd"
        return 0
    fi
    
    # 检查静态文件部署
    if [ -d "/var/www/blog" ] || [ -d "/var/www/html" ]; then
        echo "static"
        return 0
    fi
    
    # 默认返回静态模式
    echo "static"
}

# 获取最新备份
get_latest_backup() {
    local pattern="$1"
    local latest_backup
    
    if [ -n "$SPECIFIED_VERSION" ]; then
        # 查找指定版本的备份
        latest_backup=$(find "$BACKUP_DIR" -name "*$SPECIFIED_VERSION*.tar.gz" | head -1)
        if [ -z "$latest_backup" ]; then
            log_error "未找到版本 $SPECIFIED_VERSION 的备份"
            return 1
        fi
    else
        # 获取最新的备份
        latest_backup=$(ls -t "$BACKUP_DIR"/*.tar.gz 2>/dev/null | head -1)
        if [ -z "$latest_backup" ]; then
            log_error "未找到任何备份文件"
            return 1
        fi
    fi
    
    echo "$latest_backup"
}

# 创建当前状态备份
create_current_backup() {
    log_info "创建当前状态备份..."
    
    local timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
    local current_backup="$BACKUP_DIR/current_state_before_rollback_$timestamp.tar.gz"
    
    case "$DEPLOYMENT_MODE" in
        docker)
            # 备份 Docker 容器配置和数据
            if docker ps --format "table {{.Names}}" | grep -q "blog\|white-orange"; then
                local container_name=$(docker ps --format "table {{.Names}}" | grep "blog\|white-orange" | head -1)
                docker export "$container_name" | gzip > "$current_backup"
            fi
            ;;
        pm2|systemd)
            # 备份应用程序目录
            if [ -d "/opt/blog" ]; then
                tar -czf "$current_backup" -C /opt blog
            elif [ -d "/var/www/blog" ]; then
                tar -czf "$current_backup" -C /var/www blog
            fi
            ;;
        static)
            # 备份静态文件
            if [ -d "/var/www/blog" ]; then
                tar -czf "$current_backup" -C /var/www blog
            elif [ -d "/var/www/html" ]; then
                tar -czf "$current_backup" -C /var/www html
            fi
            ;;
    esac
    
    if [ -f "$current_backup" ]; then
        log_success "当前状态已备份到: $current_backup"
    else
        log_warning "无法创建当前状态备份"
    fi
}

# 停止服务
stop_services() {
    log_info "停止相关服务..."
    
    case "$DEPLOYMENT_MODE" in
        docker)
            local container_name=$(docker ps --format "table {{.Names}}" | grep "blog\|white-orange" | head -1)
            if [ -n "$container_name" ]; then
                if [ "$TEST_MODE" = false ]; then
                    docker stop "$container_name" || log_warning "无法停止容器 $container_name"
                else
                    log_info "[测试模式] 将停止 Docker 容器: $container_name"
                fi
            fi
            ;;
        pm2)
            if command -v pm2 >/dev/null 2>&1; then
                if [ "$TEST_MODE" = false ]; then
                    pm2 stop blog 2>/dev/null || pm2 stop white-orange-blog 2>/dev/null || log_warning "无法停止 PM2 进程"
                else
                    log_info "[测试模式] 将停止 PM2 进程"
                fi
            fi
            ;;
        systemd)
            if [ "$TEST_MODE" = false ]; then
                systemctl stop blog 2>/dev/null || systemctl stop white-orange-blog 2>/dev/null || log_warning "无法停止 systemd 服务"
            else
                log_info "[测试模式] 将停止 systemd 服务"
            fi
            ;;
        static)
            # 静态部署通常不需要停止服务
            log_info "静态部署，无需停止服务"
            ;;
    esac
}

# 恢复备份
restore_backup() {
    local backup_file="$1"
    
    log_info "恢复备份: $(basename "$backup_file")"
    
    if [ ! -f "$backup_file" ]; then
        log_error "备份文件不存在: $backup_file"
        return 1
    fi
    
    case "$DEPLOYMENT_MODE" in
        docker)
            log_info "恢复 Docker 容器..."
            local container_name="blog-rollback-$(date +%s)"
            
            if [ "$TEST_MODE" = false ]; then
                # 删除现有容器
                docker rm -f $(docker ps -aq --filter "name=blog") 2>/dev/null || true
                
                # 从备份恢复容器
                gunzip -c "$backup_file" | docker import - "$container_name"
                docker run -d --name blog -p 3000:3000 "$container_name"
            else
                log_info "[测试模式] 将从备份恢复 Docker 容器"
            fi
            ;;
        pm2|systemd)
            log_info "恢复应用程序文件..."
            local target_dir="/opt/blog"
            
            if [ -d "/var/www/blog" ]; then
                target_dir="/var/www/blog"
            fi
            
            if [ "$TEST_MODE" = false ]; then
                # 备份现有目录
                if [ -d "$target_dir" ]; then
                    mv "$target_dir" "${target_dir}.backup.$(date +%s)" 2>/dev/null || true
                fi
                
                # 解压备份
                mkdir -p "$(dirname "$target_dir")"
                tar -xzf "$backup_file" -C "$(dirname "$target_dir")"
            else
                log_info "[测试模式] 将恢复应用程序到: $target_dir"
            fi
            ;;
        static)
            log_info "恢复静态文件..."
            local static_dir="/var/www/blog"
            
            if [ -d "/var/www/html" ] && [ ! -d "/var/www/blog" ]; then
                static_dir="/var/www/html"
            fi
            
            if [ "$TEST_MODE" = false ]; then
                # 备份现有文件
                if [ -d "$static_dir" ]; then
                    mv "$static_dir" "${static_dir}.backup.$(date +%s)" 2>/dev/null || true
                fi
                
                # 解压备份
                mkdir -p "$(dirname "$static_dir")"
                tar -xzf "$backup_file" -C "$(dirname "$static_dir")"
            else
                log_info "[测试模式] 将恢复静态文件到: $static_dir"
            fi
            ;;
    esac
}

# 启动服务
start_services() {
    log_info "启动服务..."
    
    case "$DEPLOYMENT_MODE" in
        docker)
            if [ "$TEST_MODE" = false ]; then
                # Docker 容器在恢复时已经启动
                log_success "Docker 容器已启动"
            else
                log_info "[测试模式] 将启动 Docker 容器"
            fi
            ;;
        pm2)
            if command -v pm2 >/dev/null 2>&1; then
                if [ "$TEST_MODE" = false ]; then
                    cd /opt/blog || cd /var/www/blog
                    pm2 start ecosystem.config.js || log_warning "无法启动 PM2 进程"
                else
                    log_info "[测试模式] 将启动 PM2 进程"
                fi
            fi
            ;;
        systemd)
            if [ "$TEST_MODE" = false ]; then
                systemctl start blog 2>/dev/null || systemctl start white-orange-blog 2>/dev/null || log_warning "无法启动 systemd 服务"
            else
                log_info "[测试模式] 将启动 systemd 服务"
            fi
            ;;
        static)
            # 静态部署通常不需要启动服务
            log_info "静态部署已恢复，无需启动额外服务"
            ;;
    esac
}

# 验证回滚结果
verify_rollback() {
    log_info "验证回滚结果..."
    
    local health_check_url="http://localhost:3000"
    local max_attempts=6
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        log_info "尝试 $attempt/$max_attempts: 检查应用程序状态..."
        
        if curl -s --max-time 10 "$health_check_url" >/dev/null 2>&1; then
            log_success "应用程序响应正常"
            
            # 运行完整的健康检查（如果脚本存在）
            if [ -f "./scripts/health-check.sh" ] && [ "$TEST_MODE" = false ]; then
                log_info "运行详细健康检查..."
                if ./scripts/health-check.sh "$health_check_url"; then
                    log_success "健康检查通过"
                    return 0
                else
                    log_warning "健康检查发现问题，但应用程序可访问"
                    return 0
                fi
            else
                return 0
            fi
        fi
        
        if [ $attempt -lt $max_attempts ]; then
            log_info "等待 10 秒后重试..."
            sleep 10
        fi
        
        attempt=$((attempt + 1))
    done
    
    log_error "应用程序在回滚后无法正常响应"
    return 1
}

# 主回滚流程
perform_rollback() {
    local backup_file
    
    # 检测部署模式
    if [ "$DEPLOYMENT_MODE" = "auto" ]; then
        DEPLOYMENT_MODE=$(detect_deployment_mode)
        log_info "检测到部署模式: $DEPLOYMENT_MODE"
    fi
    
    # 获取备份文件
    backup_file=$(get_latest_backup) || exit 1
    
    log_info "将要回滚到: $(basename "$backup_file")"
    log_info "部署模式: $DEPLOYMENT_MODE"
    
    if [ "$TEST_MODE" = true ]; then
        log_warning "测试模式已启用，将模拟回滚过程"
    fi
    
    # 确认回滚
    if [ "$FORCE_MODE" = false ] && [ "$TEST_MODE" = false ]; then
        echo ""
        log_warning "此操作将回滚当前部署到之前的版本"
        log_warning "当前状态将被备份，但可能会丢失最新的更改"
        echo ""
        read -p "确定要继续吗？ (y/N): " -n 1 -r
        echo ""
        
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "回滚已取消"
            exit 0
        fi
    fi
    
    echo ""
    log_info "开始回滚过程..."
    
    # 创建当前状态备份
    if [ "$TEST_MODE" = false ]; then
        create_current_backup
    fi
    
    # 停止服务
    stop_services
    
    # 恢复备份
    restore_backup "$backup_file"
    
    # 启动服务
    start_services
    
    # 等待服务启动
    if [ "$TEST_MODE" = false ]; then
        log_info "等待服务启动..."
        sleep 5
    fi
    
    # 验证回滚
    if [ "$TEST_MODE" = false ]; then
        if verify_rollback; then
            log_success "🎉 回滚成功完成！"
        else
            log_error "回滚验证失败，请手动检查应用程序状态"
            return 1
        fi
    else
        log_success "🎉 测试模式回滚过程验证完成！"
    fi
}

# 错误处理
handle_error() {
    log_error "回滚过程中发生错误，脚本在第 $1 行退出"
    log_error "请检查错误信息并考虑手动恢复"
    
    # 提供恢复建议
    echo ""
    log_info "恢复建议："
    echo "  1. 检查服务状态"
    echo "  2. 查看系统日志"
    echo "  3. 手动启动服务"
    echo "  4. 联系系统管理员"
    
    exit 1
}

trap 'handle_error $LINENO' ERR

# 检查必要的工具
missing_tools=()

if ! command -v curl >/dev/null 2>&1; then
    missing_tools+=("curl")
fi

if ! command -v tar >/dev/null 2>&1; then
    missing_tools+=("tar")
fi

if [ ${#missing_tools[@]} -ne 0 ]; then
    log_error "缺少必要的工具: ${missing_tools[*]}"
    log_error "请安装这些工具后重试"
    exit 1
fi

# 执行主函数
perform_rollback

echo ""
log_info "回滚操作完成。"
log_info "建议监控应用程序日志以确保一切正常运行。"