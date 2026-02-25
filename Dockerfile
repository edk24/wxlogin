# 多阶段构建 - 前后端一体镜像

# 阶段1: 构建后端
FROM node:18-alpine AS server-builder
WORKDIR /app/server
COPY server/package*.json server/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY server/ ./
RUN pnpm run build

# 阶段2: 构建前端
FROM node:18-alpine AS admin-builder
WORKDIR /app/admin
COPY admin/package*.json admin/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY admin/ ./
RUN pnpm run build

# 阶段3: 生产镜像
FROM node:18-alpine

# 安装 Nginx 和 supervisor
RUN apk add --no-cache nginx supervisor

# 创建工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制后端生产依赖
COPY server/package*.json server/pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# 复制后端构建产物
COPY --from=server-builder /app/server/dist ./dist

# 复制前端构建产物到 Nginx 目录
COPY --from=admin-builder /app/admin/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx-unified.conf /etc/nginx/http.d/default.conf

# 复制 supervisor 配置
COPY supervisord.conf /etc/supervisord.conf

# 创建日志目录
RUN mkdir -p /var/log/supervisor /var/log/nginx /run/nginx

# 暴露端口
EXPOSE 80

# 启动 supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
