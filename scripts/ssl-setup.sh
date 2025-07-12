#!/bin/bash

# SSL 证书配置脚本
# 使用 Let's Encrypt 自动获取 SSL 证书

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

# 检查参数
if [[ $# -lt 1 ]]; then
    echo "使用方法: ./scripts/ssl-setup.sh <domain> [www.domain]"
    echo "示例: ./scripts/ssl-setup.sh example.com www.example.com"
    exit 1
fi

DOMAIN=$1
WWW_DOMAIN=${2:-"www.$DOMAIN"}

log "为域名 $DOMAIN 和 $WWW_DOMAIN 配置 SSL 证书..."

# 检查是否为 root 用户
if [[ $EUID -ne 0 ]]; then
    error "请使用 root 用户或 sudo 运行此脚本"
fi

# 检查域名解析
check_dns() {
    log "检查域名解析..."
    
    local server_ip=$(curl -s ifconfig.me)
    local domain_ip=$(dig +short $DOMAIN)
    local www_ip=$(dig +short $WWW_DOMAIN)
    
    if [[ "$domain_ip" != "$server_ip" ]]; then
        warning "$DOMAIN 的 DNS 记录 ($domain_ip) 不指向当前服务器 ($server_ip)"
    else
        success "$DOMAIN DNS 解析正确"
    fi
    
    if [[ "$www_ip" != "$server_ip" ]]; then
        warning "$WWW_DOMAIN 的 DNS 记录 ($www_ip) 不指向当前服务器 ($server_ip)"
    else
        success "$WWW_DOMAIN DNS 解析正确"
    fi
}

# 安装 Certbot
install_certbot() {
    log "安装 Certbot..."
    
    # 更新包列表
    apt update
    
    # 安装 Certbot
    apt install -y certbot python3-certbot-nginx
    
    success "Certbot 安装完成"
}

# 配置 Nginx
configure_nginx() {
    log "配置 Nginx..."
    
    # 创建临时配置文件
    local temp_conf="/etc/nginx/sites-available/temp-$DOMAIN"
    
    cat > "$temp_conf" << EOF
server {
    listen 80;
    server_name $DOMAIN $WWW_DOMAIN;
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}
EOF
    
    # 启用配置
    ln -sf "$temp_conf" "/etc/nginx/sites-enabled/temp-$DOMAIN"
    
    # 创建验证目录
    mkdir -p /var/www/html
    
    # 测试配置
    nginx -t
    
    # 重载 Nginx
    systemctl reload nginx
    
    success "Nginx 配置完成"
}

# 获取证书
get_certificate() {
    log "获取 SSL 证书..."
    
    # 使用 Certbot 获取证书
    certbot certonly \
        --webroot \
        --webroot-path=/var/www/html \
        --email="${SSL_EMAIL:-admin@$DOMAIN}" \
        --agree-tos \
        --no-eff-email \
        -d "$DOMAIN" \
        -d "$WWW_DOMAIN"
    
    success "SSL 证书获取完成"
}

# 配置 SSL
configure_ssl() {
    log "配置 SSL..."
    
    # 复制博客配置
    cp nginx/sites-available/blog.conf /etc/nginx/sites-available/$DOMAIN.conf
    
    # 更新域名
    sed -i "s/yourdomain.com/$DOMAIN/g" /etc/nginx/sites-available/$DOMAIN.conf
    sed -i "s/www.yourdomain.com/$WWW_DOMAIN/g" /etc/nginx/sites-available/$DOMAIN.conf
    
    # 更新证书路径
    sed -i "s|/etc/nginx/ssl/yourdomain.com.pem|/etc/letsencrypt/live/$DOMAIN/fullchain.pem|g" /etc/nginx/sites-available/$DOMAIN.conf
    sed -i "s|/etc/nginx/ssl/yourdomain.com.key|/etc/letsencrypt/live/$DOMAIN/privkey.pem|g" /etc/nginx/sites-available/$DOMAIN.conf
    
    # 删除临时配置
    rm -f /etc/nginx/sites-enabled/temp-$DOMAIN
    
    # 启用新配置
    ln -sf /etc/nginx/sites-available/$DOMAIN.conf /etc/nginx/sites-enabled/$DOMAIN.conf
    
    # 测试配置
    nginx -t
    
    # 重载 Nginx
    systemctl reload nginx
    
    success "SSL 配置完成"
}

# 设置自动续期
setup_auto_renewal() {
    log "设置自动续期..."
    
    # 创建续期脚本
    cat > /usr/local/bin/certbot-renew.sh << 'EOF'
#!/bin/bash
certbot renew --quiet
systemctl reload nginx
EOF
    
    chmod +x /usr/local/bin/certbot-renew.sh
    
    # 添加到 crontab
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/local/bin/certbot-renew.sh") | crontab -
    
    success "自动续期设置完成"
}

# 测试 SSL
test_ssl() {
    log "测试 SSL 配置..."
    
    # 等待服务启动
    sleep 5
    
    # 测试 HTTPS
    if curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" | grep -q "200"; then
        success "HTTPS 测试通过"
    else
        warning "HTTPS 测试失败，请检查配置"
    fi
    
    # 测试 HTTP 重定向
    if curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN" | grep -q "301"; then
        success "HTTP 重定向测试通过"
    else
        warning "HTTP 重定向测试失败"
    fi
}

# 显示结果
show_results() {
    echo ""
    echo "==============================================="
    echo "           SSL 证书配置完成！"
    echo "==============================================="
    echo ""
    echo "域名: $DOMAIN"
    echo "WWW 域名: $WWW_DOMAIN"
    echo "证书位置: /etc/letsencrypt/live/$DOMAIN/"
    echo "Nginx 配置: /etc/nginx/sites-available/$DOMAIN.conf"
    echo ""
    echo "测试链接:"
    echo "  https://$DOMAIN"
    echo "  https://$WWW_DOMAIN"
    echo ""
    echo "证书有效期: 90 天"
    echo "自动续期: 已设置（每天12点检查）"
    echo ""
    echo "==============================================="
}

# 主函数
main() {
    log "开始 SSL 配置..."
    
    check_dns
    install_certbot
    configure_nginx
    get_certificate
    configure_ssl
    setup_auto_renewal
    test_ssl
    show_results
    
    success "SSL 配置完成！"
}

# 运行主函数
main "$@"