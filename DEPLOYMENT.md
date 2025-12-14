# 部署指南

本文档详细说明了如何将个人日记应用部署到生产环境。

## 🏗️ 部署架构

### 推荐架构
```
用户 → Nginx (反向代理) → Vue 前端 (静态文件)
                         ↓
                    Nest.js 后端 API
                         ↓
                    lowdb 数据库文件
```

## 📋 部署前准备

### 环境要求
- Ubuntu 20.04+ / CentOS 8+ / Windows Server 2019+
- Node.js 18.0+
- Nginx 1.18+ (推荐)
- PM2 (进程管理器)
- Git

### 域名和SSL (可选)
- 注册域名
- 配置DNS记录
- 申请SSL证书 (Let's Encrypt推荐)

## 🚀 生产环境部署

### 1. 服务器准备

#### 安装 Node.js
```bash
# 使用 NodeSource 仓库安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

#### 安装 PM2
```bash
sudo npm install -g pm2
```

#### 安装 Nginx
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx

# 启动并启用 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. 项目部署

#### 克隆代码
```bash
# 创建项目目录
sudo mkdir -p /var/www/diary-app
cd /var/www/diary-app

# 克隆项目 (替换为你的仓库地址)
git clone https://github.com/yourusername/diary-app.git .
```

#### 后端部署
```bash
# 进入后端目录
cd /var/www/diary-app/my-nest-app

# 安装依赖
npm ci --only=production

# 构建项目
npm run build

# 创建生产环境配置
sudo tee .env > /dev/null <<EOT
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://yourdomain.com
EOT

# 使用 PM2 启动应用
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

#### 创建 PM2 配置文件
```bash
# 在 my-nest-app 目录下创建 ecosystem.config.js
sudo tee ecosystem.config.js > /dev/null <<EOT
module.exports = {
  apps: [{
    name: 'diary-api',
    script: 'dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOT
```

#### 前端部署
```bash
# 进入前端目录
cd /var/www/diary-app/vue-diary

# 安装依赖
npm ci

# 修改 API 基础 URL (如果需要)
# 编辑 src/services/api.ts 文件中的 baseURL

# 构建生产版本
npm run build

# 复制构建文件到 Nginx 目录
sudo cp -r dist/* /var/www/html/
```

### 3. Nginx 配置

#### 创建 Nginx 配置文件
```bash
sudo tee /etc/nginx/sites-available/diary-app > /dev/null <<EOT
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # 前端静态文件
    location / {
        root /var/www/html;
        index index.html;
        try_files \$uri \$uri/ /index.html;

        # 缓存配置
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API 代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOT
```

#### 启用站点配置
```bash
sudo ln -s /etc/nginx/sites-available/diary-app /etc/nginx/sites-enabled/
sudo nginx -t  # 测试配置
sudo systemctl reload nginx
```

### 4. SSL 配置 (使用 Let's Encrypt)

#### 安装 Certbot
```bash
sudo apt install certbot python3-certbot-nginx
```

#### 获取 SSL 证书
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### 自动续期
```bash
sudo crontab -e
# 添加以下行
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🐳 Docker 部署

### 创建 Dockerfile

#### 后端 Dockerfile
```dockerfile
# my-nest-app/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

#### 前端 Dockerfile
```dockerfile
# vue-diary/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 创建 docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build: ./my-nest-app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
    restart: unless-stopped

  frontend:
    build: ./vue-diary
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  data:
```

#### 使用 Docker Compose 部署
```bash
# 构建并启动服务
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 🔒 安全配置

### 防火墙设置
```bash
# Ubuntu UFW
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable

# CentOS firewalld
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 安全加固
```bash
# 禁用 root SSH 登录
sudo nano /etc/ssh/sshd_config
# 添加: PermitRootLogin no
sudo systemctl restart ssh

# 安装 fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 📊 监控和日志

### PM2 监控
```bash
# 查看应用状态
pm2 status

# 查看实时日志
pm2 logs diary-api

# 查看监控面板
pm2 monit

# 重启应用
pm2 restart diary-api
```

### 日志管理
```bash
# 创建日志目录
sudo mkdir -p /var/log/diary-app

# 配置 logrotate
sudo tee /etc/logrotate.d/diary-app > /dev/null <<EOT
/var/www/diary-app/my-nest-app/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
EOT
```

## 🔄 数据备份

### 自动备份脚本
```bash
#!/bin/bash
# backup-diary.sh

BACKUP_DIR="/var/backups/diary-app"
DATE=$(date +%Y%m%d_%H%M%S)
DB_FILE="/var/www/diary-app/my-nest-app/diaries.json"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库文件
cp $DB_FILE $BACKUP_DIR/diaries_$DATE.json

# 压缩备份
gzip $BACKUP_DIR/diaries_$DATE.json

# 删除 7 天前的备份
find $BACKUP_DIR -name "*.json.gz" -mtime +7 -delete

echo "Backup completed: diaries_$DATE.json.gz"
```

#### 设置定时备份
```bash
# 添加到 crontab
sudo crontab -e
# 每天凌晨 2 点备份
0 2 * * * /path/to/backup-diary.sh
```

## 🚨 故障排除

### 常见问题

#### 1. 端口被占用
```bash
# 查看端口占用
sudo netstat -tlnp | grep :3000

# 杀死进程
sudo kill -9 [PID]
```

#### 2. Nginx 配置错误
```bash
# 检查 Nginx 配置
sudo nginx -t

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

#### 3. PM2 应用无法启动
```bash
# 查看详细错误信息
pm2 logs diary-api --err

# 重置 PM2
pm2 delete all
pm2 restart
```

#### 4. 数据库权限问题
```bash
# 确保数据库文件权限正确
sudo chown -R www-data:www-data /var/www/diary-app/my-nest-app/
sudo chmod 644 /var/www/diary-app/my-nest-app/diaries.json
```

### 性能优化

#### 1. 启用 Gzip 压缩
```nginx
# 在 Nginx 配置中添加
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

#### 2. 配置缓存
```nginx
# 静态资源缓存
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

#### 3. 数据库优化
```bash
# 定期清理旧数据
# 可以在应用中添加数据清理功能
```

## 📈 扩展部署

### 负载均衡
```nginx
upstream diary_api {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    location /api {
        proxy_pass http://diary_api;
        # ... 其他配置
    }
}
```

### CDN 集成
```nginx
# 静态资源使用 CDN
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    return 301 https://cdn.yourdomain.com$request_uri;
}
```

---

## 🎉 部署完成

恭喜！你的个人日记应用现在已经成功部署到生产环境。

### 后续维护
- 定期更新依赖包
- 监控应用性能
- 定期备份数据
- 查看安全更新

如有问题，请参考故障排除部分或联系技术支持。