# 微信服务号授权统一平台

## 项目简介

这是一个微信服务号授权统一平台，用于统一管理多个项目的微信OAuth授权和JSSDK签名服务。

## 技术栈

- 后端：Nest.js + TypeScript + MySQL + Redis
- 前端：React 18 + Ant Design 5

## 快速开始

### 后端服务

1. 安装依赖
```bash
cd server
npm install
```

2. 配置环境变量
```bash
cp .env.example .env
# 编辑.env文件，填入数据库和微信配置
```

3. 启动开发服务器
```bash
npm run start:dev
```

服务将在 http://localhost:3000 启动

### 前端管理后台

```bash
cd admin
npm install
npm run dev
```

## 核心功能

### 1. OAuth授权
- 静默授权（snsapi_base）
- 用户授权（snsapi_userinfo）
- 自动保存用户信息
- 授权日志记录

### 2. JSSDK签名
- 自动生成签名
- 支持分享卡片等功能

### 3. 项目管理
- 项目配置管理
- 回调域名白名单
- 项目启用/禁用

### 4. 数据统计
- 授权日志查询
- 用户列表查看
- 统计分析

## API接口

### OAuth授权
```
GET /oauth/authorize?appId=xxx&redirect=xxx&scope=xxx
GET /oauth/callback?code=xxx&state=xxx
```

### JSSDK签名
```
POST /api/jssdk/signature
Body: { url: "xxx" }
```

### 项目管理
```
GET    /admin/projects
POST   /admin/projects
PUT    /admin/projects/:id
DELETE /admin/projects/:id
```

## 微信公众号配置

1. 登录微信公众平台
2. 设置与开发 -> 公众号设置 -> 功能设置
3. 配置JS接口安全域名：auth.yourdomain.com
4. 设置与开发 -> 接口权限 -> 网页授权
5. 配置授权回调域名：auth.yourdomain.com

## 注意事项

1. 确保所有业务项目在同一个主域名下
2. 定期清理授权日志，避免数据库过大
3. 生产环境需要配置HTTPS
4. Redis用于缓存access_token和jsapi_ticket
