#!/bin/bash

# 健康检查脚本 - 验证应用程序运行状态
# 适用于 Next.js 15.3.5+ & React 19.1.0+ 博客系统

set -euo pipefail

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置参数
DEFAULT_URL="http://localhost:3000"
TIMEOUT=30
MAX_RETRIES=3
RETRY_INTERVAL=5

# 从命令行参数或环境变量获取配置
URL="${1:-${HEALTH_CHECK_URL:-$DEFAULT_URL}}"
TIMEOUT="${HEALTH_CHECK_TIMEOUT:-$TIMEOUT}"
MAX_RETRIES="${HEALTH_CHECK_RETRIES:-$MAX_RETRIES}"

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

# 显示脚本开始信息
echo "========================================"
echo "        博客系统健康检查"
echo "========================================"
echo ""
log_info "目标URL: $URL"
log_info "超时时间: ${TIMEOUT}秒"
log_info "最大重试: $MAX_RETRIES 次"
echo ""

# 健康检查状态
HEALTH_STATUS=0
CHECKS_PASSED=0
CHECKS_TOTAL=0

# 记录检查结果
record_check() {
    local name="$1"
    local status="$2"
    local message="$3"
    
    CHECKS_TOTAL=$((CHECKS_TOTAL + 1))
    
    if [ "$status" -eq 0 ]; then
        log_success "✓ $name: $message"
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
    else
        log_error "✗ $name: $message"
        HEALTH_STATUS=1
    fi
}

# HTTP 可达性检查
check_http_reachability() {
    log_info "检查 HTTP 可达性..."
    
    local retry_count=0
    local response_code
    
    while [ $retry_count -lt $MAX_RETRIES ]; do
        if response_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$URL" 2>/dev/null); then
            if [ "$response_code" -eq 200 ]; then
                record_check "HTTP可达性" 0 "响应码 $response_code"
                return 0
            else
                log_warning "尝试 $((retry_count + 1))/$MAX_RETRIES: HTTP $response_code"
            fi
        else
            log_warning "尝试 $((retry_count + 1))/$MAX_RETRIES: 连接失败"
        fi
        
        retry_count=$((retry_count + 1))
        if [ $retry_count -lt $MAX_RETRIES ]; then
            sleep $RETRY_INTERVAL
        fi
    done
    
    record_check "HTTP可达性" 1 "无法访问或响应码错误"
    return 1
}

# 响应时间检查
check_response_time() {
    log_info "检查响应时间..."
    
    local response_time
    response_time=$(curl -s -o /dev/null -w "%{time_total}" --max-time "$TIMEOUT" "$URL" 2>/dev/null || echo "timeout")
    
    if [ "$response_time" != "timeout" ]; then
        local response_ms
        response_ms=$(echo "$response_time * 1000" | bc 2>/dev/null || echo "0")
        
        if [ "$(echo "$response_time < 3.0" | bc 2>/dev/null || echo "0")" -eq 1 ]; then
            record_check "响应时间" 0 "${response_ms%.*}ms (良好)"
        elif [ "$(echo "$response_time < 5.0" | bc 2>/dev/null || echo "0")" -eq 1 ]; then
            record_check "响应时间" 0 "${response_ms%.*}ms (可接受)"
        else
            record_check "响应时间" 1 "${response_ms%.*}ms (过慢)"
        fi
    else
        record_check "响应时间" 1 "超时"
    fi
}

# 内容验证检查
check_content_validation() {
    log_info "检查页面内容..."
    
    local content
    content=$(curl -s --max-time "$TIMEOUT" "$URL" 2>/dev/null || echo "")
    
    if [ -n "$content" ]; then
        # 检查是否包含基本的HTML结构
        if echo "$content" | grep -q "<html" && echo "$content" | grep -q "</html>"; then
            record_check "HTML结构" 0 "页面包含有效的HTML结构"
        else
            record_check "HTML结构" 1 "页面缺少HTML结构"
        fi
        
        # 检查是否包含标题
        if echo "$content" | grep -q "<title>"; then
            local title
            title=$(echo "$content" | grep -o "<title>[^<]*</title>" | sed 's/<[^>]*>//g' | head -1)
            record_check "页面标题" 0 "\"$title\""
        else
            record_check "页面标题" 1 "缺少页面标题"
        fi
        
        # 检查是否包含导航
        if echo "$content" | grep -q -i "nav\|menu\|navigation"; then
            record_check "导航元素" 0 "页面包含导航元素"
        else
            record_check "导航元素" 1 "页面缺少导航元素"
        fi
        
        # 检查是否有错误信息
        if echo "$content" | grep -q -i "error\|404\|500\|internal server error"; then
            record_check "错误检查" 1 "页面包含错误信息"
        else
            record_check "错误检查" 0 "页面无明显错误"
        fi
        
    else
        record_check "内容获取" 1 "无法获取页面内容"
    fi
}

# SSL证书检查（如果是HTTPS）
check_ssl_certificate() {
    if [[ "$URL" =~ ^https:// ]]; then
        log_info "检查SSL证书..."
        
        local domain
        domain=$(echo "$URL" | sed 's|https://||' | sed 's|/.*||')
        
        local ssl_info
        ssl_info=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null || echo "")
        
        if [ -n "$ssl_info" ]; then
            local expiry_date
            expiry_date=$(echo "$ssl_info" | grep "notAfter" | cut -d= -f2-)
            
            if [ -n "$expiry_date" ]; then
                local expiry_timestamp
                expiry_timestamp=$(date -d "$expiry_date" +%s 2>/dev/null || echo "0")
                local current_timestamp
                current_timestamp=$(date +%s)
                local days_until_expiry
                days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
                
                if [ "$days_until_expiry" -gt 30 ]; then
                    record_check "SSL证书" 0 "有效，${days_until_expiry}天后过期"
                elif [ "$days_until_expiry" -gt 7 ]; then
                    record_check "SSL证书" 0 "即将过期，${days_until_expiry}天后过期"
                else
                    record_check "SSL证书" 1 "即将过期，${days_until_expiry}天后过期"
                fi
            else
                record_check "SSL证书" 1 "无法解析过期时间"
            fi
        else
            record_check "SSL证书" 1 "无法获取证书信息"
        fi
    fi
}

# API端点检查
check_api_endpoints() {
    log_info "检查API端点..."
    
    # 检查sitemap
    local sitemap_url="${URL}/sitemap.xml"
    local sitemap_response
    sitemap_response=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$sitemap_url" 2>/dev/null || echo "000")
    
    if [ "$sitemap_response" -eq 200 ]; then
        record_check "Sitemap" 0 "可访问 ($sitemap_url)"
    else
        record_check "Sitemap" 1 "不可访问 (HTTP $sitemap_response)"
    fi
    
    # 检查robots.txt
    local robots_url="${URL}/robots.txt"
    local robots_response
    robots_response=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$robots_url" 2>/dev/null || echo "000")
    
    if [ "$robots_response" -eq 200 ]; then
        record_check "Robots.txt" 0 "可访问 ($robots_url)"
    else
        record_check "Robots.txt" 1 "不可访问 (HTTP $robots_response)"
    fi
    
    # 检查RSS feed
    local rss_url="${URL}/feed.xml"
    local rss_response
    rss_response=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$rss_url" 2>/dev/null || echo "000")
    
    if [ "$rss_response" -eq 200 ]; then
        record_check "RSS Feed" 0 "可访问 ($rss_url)"
    else
        record_check "RSS Feed" 1 "不可访问 (HTTP $rss_response)"
    fi
    
    # 检查健康检查端点（如果存在）
    local health_endpoint="${URL}/api/health"
    local health_response
    health_response=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$health_endpoint" 2>/dev/null || echo "000")
    
    if [ "$health_response" -eq 200 ]; then
        record_check "健康检查API" 0 "可访问 ($health_endpoint)"
    else
        record_check "健康检查API" 1 "不可访问 (HTTP $health_response)"
    fi
}

# DNS解析检查
check_dns_resolution() {
    log_info "检查DNS解析..."
    
    local domain
    domain=$(echo "$URL" | sed 's|https\?://||' | sed 's|/.*||' | sed 's|:.*||')
    
    if [ "$domain" != "localhost" ] && [ "$domain" != "127.0.0.1" ]; then
        if nslookup "$domain" >/dev/null 2>&1; then
            local ip_address
            ip_address=$(nslookup "$domain" | grep "Address:" | tail -1 | awk '{print $2}' || echo "unknown")
            record_check "DNS解析" 0 "$domain -> $ip_address"
        else
            record_check "DNS解析" 1 "无法解析 $domain"
        fi
    else
        record_check "DNS解析" 0 "本地地址，跳过DNS检查"
    fi
}

# 服务器资源检查（如果是本地）
check_server_resources() {
    if [[ "$URL" =~ localhost|127\.0\.0\.1 ]]; then
        log_info "检查服务器资源..."
        
        # 检查CPU使用率
        if command -v top >/dev/null 2>&1; then
            local cpu_usage
            cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1 2>/dev/null || echo "unknown")
            
            if [ "$cpu_usage" != "unknown" ]; then
                if [ "$(echo "$cpu_usage < 80" | bc 2>/dev/null || echo "1")" -eq 1 ]; then
                    record_check "CPU使用率" 0 "${cpu_usage}%"
                else
                    record_check "CPU使用率" 1 "${cpu_usage}% (高)"
                fi
            fi
        fi
        
        # 检查内存使用率
        if command -v free >/dev/null 2>&1; then
            local memory_info
            memory_info=$(free | grep Mem)
            local total_mem
            total_mem=$(echo "$memory_info" | awk '{print $2}')
            local used_mem
            used_mem=$(echo "$memory_info" | awk '{print $3}')
            local mem_usage
            mem_usage=$(echo "scale=1; $used_mem * 100 / $total_mem" | bc 2>/dev/null || echo "unknown")
            
            if [ "$mem_usage" != "unknown" ]; then
                if [ "$(echo "$mem_usage < 85" | bc 2>/dev/null || echo "1")" -eq 1 ]; then
                    record_check "内存使用率" 0 "${mem_usage}%"
                else
                    record_check "内存使用率" 1 "${mem_usage}% (高)"
                fi
            fi
        fi
        
        # 检查磁盘空间
        if command -v df >/dev/null 2>&1; then
            local disk_usage
            disk_usage=$(df -h / | tail -1 | awk '{print $5}' | cut -d'%' -f1 2>/dev/null || echo "unknown")
            
            if [ "$disk_usage" != "unknown" ]; then
                if [ "$disk_usage" -lt 85 ]; then
                    record_check "磁盘使用率" 0 "${disk_usage}%"
                else
                    record_check "磁盘使用率" 1 "${disk_usage}% (高)"
                fi
            fi
        fi
        
        # 检查进程是否运行
        if pgrep -f "next" >/dev/null || pgrep -f "node.*server" >/dev/null; then
            record_check "应用进程" 0 "Next.js 应用正在运行"
        else
            record_check "应用进程" 1 "未找到 Next.js 应用进程"
        fi
    fi
}

# Core Web Vitals 模拟检查
check_performance_metrics() {
    log_info "检查性能指标..."
    
    # 使用 curl 的详细计时信息
    local timing_info
    timing_info=$(curl -s -o /dev/null -w "dns_lookup:%{time_namelookup}\nconnect:%{time_connect}\nssl_handshake:%{time_appconnect}\nfirst_byte:%{time_starttransfer}\ntotal:%{time_total}" --max-time "$TIMEOUT" "$URL" 2>/dev/null || echo "")
    
    if [ -n "$timing_info" ]; then
        local ttfb
        ttfb=$(echo "$timing_info" | grep "first_byte:" | cut -d: -f2)
        local ttfb_ms
        ttfb_ms=$(echo "$ttfb * 1000" | bc 2>/dev/null || echo "0")
        
        if [ "$(echo "$ttfb < 0.8" | bc 2>/dev/null || echo "0")" -eq 1 ]; then
            record_check "TTFB (首字节时间)" 0 "${ttfb_ms%.*}ms (优秀)"
        elif [ "$(echo "$ttfb < 1.8" | bc 2>/dev/null || echo "0")" -eq 1 ]; then
            record_check "TTFB (首字节时间)" 0 "${ttfb_ms%.*}ms (良好)"
        else
            record_check "TTFB (首字节时间)" 1 "${ttfb_ms%.*}ms (需要改进)"
        fi
    fi
}

# 执行所有检查
main() {
    # 基础检查
    check_dns_resolution
    check_http_reachability || exit 1  # 如果基础连接失败，直接退出
    
    # 性能检查
    check_response_time
    check_performance_metrics
    
    # 内容检查
    check_content_validation
    
    # SSL检查
    check_ssl_certificate
    
    # API端点检查
    check_api_endpoints
    
    # 服务器资源检查（本地）
    check_server_resources
    
    # 显示总结
    echo ""
    echo "========================================"
    echo "        健康检查总结"
    echo "========================================"
    echo ""
    
    log_info "检查完成: $CHECKS_PASSED/$CHECKS_TOTAL 项通过"
    
    if [ $HEALTH_STATUS -eq 0 ]; then
        log_success "🎉 应用程序健康状况良好！"
        echo ""
        log_info "所有关键检查都已通过，应用程序运行正常。"
    else
        log_error "⚠️  发现问题，请检查失败的项目。"
        echo ""
        log_info "建议："
        echo "  1. 检查应用程序日志"
        echo "  2. 验证配置文件"
        echo "  3. 重启应用程序（如果需要）"
        echo "  4. 联系系统管理员"
    fi
    
    echo ""
    
    # 显示下次检查提示
    log_info "建议定期运行健康检查："
    echo "  手动检查: $0 [URL]"
    echo "  定时检查: */5 * * * * $0 >/var/log/health-check.log 2>&1"
    
    exit $HEALTH_STATUS
}

# 信号处理
trap 'log_error "健康检查被中断"; exit 1' INT TERM

# 检查必要的工具
if ! command -v curl >/dev/null 2>&1; then
    log_error "curl 未安装，无法执行健康检查"
    exit 1
fi

# 运行主函数
main "$@"