export const integrationDoc = `# 微信授权统一平台对接文档

## 概述

本平台提供统一的微信服务号授权服务，支持多个项目共享同一个微信服务号，实现用户授权登录和信息获取。

## 对接流程

### 1. 获取项目配置

在后台管理系统中创建项目，获取以下信息：
- **项目标识 (app_id)**: 唯一标识你的项目
- **回调地址 (redirect_uri)**: 授权成功后的回调地址

### 2. 发起授权

#### 静默授权 (snsapi_base)

适用于只需要获取用户 openid 的场景，用户无感知。

\`\`\`
GET /auth/authorize?app_id={项目标识}&redirect_uri={回调地址}&scope=snsapi_base
\`\`\`

#### 用户信息授权 (snsapi_userinfo)

需要用户手动确认，可获取用户昵称、头像等信息。

\`\`\`
GET /auth/authorize?app_id={项目标识}&redirect_uri={回调地址}&scope=snsapi_userinfo
\`\`\`

### 3. 处理回调

授权成功后，系统会重定向到你配置的回调地址，并携带以下参数：

\`\`\`
{回调地址}?code={临时授权码}&state={自定义参数}
\`\`\`

### 4. 获取用户信息

使用临时授权码换取用户信息：

\`\`\`
GET /auth/callback?code={临时授权码}
\`\`\`

返回数据：
\`\`\`json
{
  "openid": "用户唯一标识",
  "nickname": "用户昵称",
  "avatar": "头像URL",
  "sex": 1,
  "province": "省份",
  "city": "城市"
}
\`\`\`

## JSSDK 配置

如需使用微信 JSSDK（分享、扫码等功能），需要获取签名配置。

### 获取签名

\`\`\`
GET /jssdk/signature?url={当前页面URL}
\`\`\`

返回数据：
\`\`\`json
{
  "appId": "微信AppID",
  "timestamp": 1234567890,
  "nonceStr": "随机字符串",
  "signature": "签名"
}
\`\`\`

### 前端配置

\`\`\`javascript
wx.config({
  appId: data.appId,
  timestamp: data.timestamp,
  nonceStr: data.nonceStr,
  signature: data.signature,
  jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData']
});
\`\`\`

## 注意事项

1. **回调地址必须与配置一致**：系统会验证回调地址，不一致会拒绝授权
2. **临时授权码有效期**：code 有效期为 5 分钟，请及时使用
3. **HTTPS 要求**：生产环境必须使用 HTTPS 协议
4. **域名白名单**：确保你的域名已在微信公众平台配置

## 示例代码

### Node.js 示例

\`\`\`javascript
// 发起授权
const authUrl = \`https://your-domain.com/auth/authorize?app_id=project1&redirect_uri=\${encodeURIComponent('https://your-app.com/callback')}&scope=snsapi_userinfo\`;
window.location.href = authUrl;

// 处理回调
const code = new URLSearchParams(window.location.search).get('code');
const response = await fetch(\`https://your-domain.com/auth/callback?code=\${code}\`);
const userInfo = await response.json();
\`\`\`

## 常见问题

### Q: 授权失败怎么办？
A: 检查项目状态是否启用，回调地址是否正确配置。

### Q: 如何测试？
A: 可以使用微信开发者工具或在微信内置浏览器中测试。

### Q: 支持多个回调地址吗？
A: 目前每个项目只支持一个回调地址，如需多个请创建多个项目。

## 技术支持

如有问题，请联系技术支持团队。
`;
