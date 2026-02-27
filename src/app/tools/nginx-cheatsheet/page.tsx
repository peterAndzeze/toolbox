"use client";

import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { CheatSheet, CheatItem } from "@/components/CheatSheet";

const categories = ["基本命令", "基础配置", "虚拟主机", "反向代理", "负载均衡", "HTTPS/SSL", "缓存配置", "安全配置", "日志配置", "常见问题"];

const items: CheatItem[] = [
  // 基本命令
  { category: "基本命令", title: "启动 Nginx", description: "启动 Nginx 服务", code: "# 启动\nnginx\n# 或\nsystemctl start nginx" },
  { category: "基本命令", title: "停止 Nginx", description: "停止 Nginx 服务", code: "# 优雅停止\nnginx -s quit\n# 立即停止\nnginx -s stop\n# 或\nsystemctl stop nginx" },
  { category: "基本命令", title: "重新加载配置", description: "不停机重载配置文件", code: "nginx -s reload\n# 或\nsystemctl reload nginx" },
  { category: "基本命令", title: "测试配置", description: "检查配置文件语法是否正确", code: "nginx -t\n# 输出配置文件路径\nnginx -T" },
  { category: "基本命令", title: "查看版本", description: "查看 Nginx 版本和编译信息", code: "nginx -v      # 版本\nnginx -V      # 版本+编译参数" },

  // 基础配置
  { category: "基础配置", title: "主配置结构", description: "nginx.conf 基本结构", code: "# /etc/nginx/nginx.conf\nworker_processes auto;\nevents {\n    worker_connections 1024;\n}\nhttp {\n    include       mime.types;\n    default_type  application/octet-stream;\n    sendfile      on;\n    keepalive_timeout 65;\n\n    # 引入站点配置\n    include /etc/nginx/conf.d/*.conf;\n}" },
  { category: "基础配置", title: "静态文件服务", description: "最简单的静态网站配置", code: "server {\n    listen 80;\n    server_name example.com;\n    root /var/www/html;\n    index index.html;\n\n    location / {\n        try_files $uri $uri/ =404;\n    }\n}" },
  { category: "基础配置", title: "Gzip 压缩", description: "开启 Gzip 减少传输量", code: "gzip on;\ngzip_vary on;\ngzip_min_length 1024;\ngzip_comp_level 6;\ngzip_types\n    text/plain\n    text/css\n    text/javascript\n    application/json\n    application/javascript\n    image/svg+xml;" },

  // 虚拟主机
  { category: "虚拟主机", title: "基于域名", description: "不同域名指向不同站点", code: "# site-a.conf\nserver {\n    listen 80;\n    server_name a.example.com;\n    root /var/www/site-a;\n}\n\n# site-b.conf\nserver {\n    listen 80;\n    server_name b.example.com;\n    root /var/www/site-b;\n}" },
  { category: "虚拟主机", title: "基于端口", description: "不同端口提供不同服务", code: "server {\n    listen 8001;\n    server_name localhost;\n    root /var/www/app1;\n}\nserver {\n    listen 8002;\n    server_name localhost;\n    root /var/www/app2;\n}" },

  // 反向代理
  { category: "反向代理", title: "基本反向代理", description: "将请求转发到后端服务", code: "server {\n    listen 80;\n    server_name api.example.com;\n\n    location / {\n        proxy_pass http://127.0.0.1:8080;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n    }\n}" },
  { category: "反向代理", title: "WebSocket 代理", description: "支持 WebSocket 连接", code: "location /ws {\n    proxy_pass http://127.0.0.1:3000;\n    proxy_http_version 1.1;\n    proxy_set_header Upgrade $http_upgrade;\n    proxy_set_header Connection \"upgrade\";\n    proxy_set_header Host $host;\n}" },
  { category: "反向代理", title: "路径转发", description: "按 URL 路径分发到不同后端", code: "location /api/ {\n    proxy_pass http://127.0.0.1:8080/;\n}\nlocation /admin/ {\n    proxy_pass http://127.0.0.1:9090/;\n}\nlocation / {\n    root /var/www/frontend;\n    try_files $uri $uri/ /index.html;\n}" },
  { category: "反向代理", title: "超时设置", description: "配置代理超时参数", code: "location /api/ {\n    proxy_pass http://backend;\n    proxy_connect_timeout 60s;\n    proxy_read_timeout 300s;\n    proxy_send_timeout 60s;\n    proxy_buffering on;\n    proxy_buffer_size 4k;\n    proxy_buffers 8 16k;\n}" },

  // 负载均衡
  { category: "负载均衡", title: "轮询（默认）", description: "请求依次分发到各服务器", code: "upstream backend {\n    server 192.168.1.10:8080;\n    server 192.168.1.11:8080;\n    server 192.168.1.12:8080;\n}\nserver {\n    listen 80;\n    location / {\n        proxy_pass http://backend;\n    }\n}" },
  { category: "负载均衡", title: "加权轮询", description: "按权重分配请求比例", code: "upstream backend {\n    server 192.168.1.10:8080 weight=5;\n    server 192.168.1.11:8080 weight=3;\n    server 192.168.1.12:8080 weight=2;\n}" },
  { category: "负载均衡", title: "IP Hash", description: "同一 IP 固定访问同一后端", code: "upstream backend {\n    ip_hash;\n    server 192.168.1.10:8080;\n    server 192.168.1.11:8080;\n}" },
  { category: "负载均衡", title: "健康检查", description: "自动剔除故障服务器", code: "upstream backend {\n    server 192.168.1.10:8080 max_fails=3 fail_timeout=30s;\n    server 192.168.1.11:8080 max_fails=3 fail_timeout=30s;\n    server 192.168.1.12:8080 backup;  # 备用服务器\n}" },

  // HTTPS
  { category: "HTTPS/SSL", title: "HTTPS 配置", description: "配置 SSL 证书启用 HTTPS", code: "server {\n    listen 443 ssl;\n    server_name example.com;\n\n    ssl_certificate     /etc/nginx/ssl/cert.pem;\n    ssl_certificate_key /etc/nginx/ssl/key.pem;\n    ssl_protocols TLSv1.2 TLSv1.3;\n    ssl_ciphers HIGH:!aNULL:!MD5;\n\n    location / {\n        root /var/www/html;\n    }\n}" },
  { category: "HTTPS/SSL", title: "HTTP 跳转 HTTPS", description: "强制所有请求使用 HTTPS", code: "server {\n    listen 80;\n    server_name example.com;\n    return 301 https://$server_name$request_uri;\n}" },
  { category: "HTTPS/SSL", title: "Let's Encrypt 证书", description: "用 Certbot 申请免费证书", code: "# 安装 certbot\nsudo apt install certbot python3-certbot-nginx\n# 申请证书（自动配置 Nginx）\nsudo certbot --nginx -d example.com\n# 续期\nsudo certbot renew" },

  // 缓存
  { category: "缓存配置", title: "静态文件缓存", description: "为静态资源设置浏览器缓存", code: "location ~* \\.(jpg|jpeg|png|gif|ico|css|js|woff2)$ {\n    expires 30d;\n    add_header Cache-Control \"public, immutable\";\n}" },
  { category: "缓存配置", title: "代理缓存", description: "缓存后端响应", code: "proxy_cache_path /tmp/nginx_cache levels=1:2\n    keys_zone=my_cache:10m max_size=1g\n    inactive=60m;\n\nserver {\n    location /api/ {\n        proxy_pass http://backend;\n        proxy_cache my_cache;\n        proxy_cache_valid 200 10m;\n        proxy_cache_valid 404 1m;\n        add_header X-Cache-Status $upstream_cache_status;\n    }\n}" },

  // 安全
  { category: "安全配置", title: "限流", description: "限制请求速率防止滥用", code: "# 定义限流区域\nlimit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;\n\nserver {\n    location /api/ {\n        limit_req zone=api burst=20 nodelay;\n        proxy_pass http://backend;\n    }\n}" },
  { category: "安全配置", title: "IP 黑白名单", description: "限制或允许特定 IP 访问", code: "location /admin/ {\n    allow 192.168.1.0/24;\n    allow 10.0.0.1;\n    deny all;\n}" },
  { category: "安全配置", title: "安全响应头", description: "添加常用安全 HTTP 头", code: "add_header X-Frame-Options SAMEORIGIN;\nadd_header X-Content-Type-Options nosniff;\nadd_header X-XSS-Protection \"1; mode=block\";\nadd_header Strict-Transport-Security \"max-age=31536000; includeSubDomains\" always;" },
  { category: "安全配置", title: "隐藏版本号", description: "不在响应头暴露 Nginx 版本", code: "server_tokens off;" },

  // 日志
  { category: "日志配置", title: "访问日志", description: "配置访问日志格式和路径", code: "log_format main '$remote_addr - $remote_user [$time_local] '\n    '\"$request\" $status $body_bytes_sent '\n    '\"$http_referer\" \"$http_user_agent\"';\n\naccess_log /var/log/nginx/access.log main;" },
  { category: "日志配置", title: "错误日志", description: "配置错误日志级别", code: "# 级别: debug/info/notice/warn/error/crit\nerror_log /var/log/nginx/error.log warn;" },
  { category: "日志配置", title: "关闭特定日志", description: "关闭静态资源的访问日志", code: "location ~* \\.(js|css|png|jpg|gif|ico)$ {\n    access_log off;\n}" },

  // 常见问题
  { category: "常见问题", title: "SPA 路由配置", description: "Vue/React 单页应用路由", code: "location / {\n    root /var/www/dist;\n    index index.html;\n    try_files $uri $uri/ /index.html;\n}" },
  { category: "常见问题", title: "跨域 CORS", description: "配置跨域允许", code: "location /api/ {\n    add_header Access-Control-Allow-Origin *;\n    add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, OPTIONS';\n    add_header Access-Control-Allow-Headers 'Content-Type, Authorization';\n    if ($request_method = OPTIONS) {\n        return 204;\n    }\n    proxy_pass http://backend;\n}" },
  { category: "常见问题", title: "文件上传大小", description: "调大上传文件限制", code: "# 全局或 server/location 内\nclient_max_body_size 100M;" },
];

export default function NginxCheatSheetPage() {
  return (
    <ToolPageWrapper>
      <CheatSheet
        title="Nginx 配置速查"
        subtitle="Nginx 常用配置速查：反向代理、负载均衡、HTTPS、缓存、安全等"
        items={items}
        categories={categories}
      />
    </ToolPageWrapper>
  );
}
