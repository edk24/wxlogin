export const integrationDoc = `# 微信授权统一平台对接文档

## 概述

本平台提供统一的微信服务号授权服务，支持多个项目共享同一个微信服务号，实现用户授权登录和信息获取。

**平台地址**: \`https://auth.activity.ioi.plus/api\`

## 对接流程

### 1. 获取项目配置

在后台管理系统中创建项目，获取以下信息：
- **项目标识 (app_id)**: 唯一标识你的项目，例如：\`project1\`
- **回调地址 (redirect_uri)**: 授权成功后的回调地址，必须是完整的 HTTPS 地址

### 2. 发起授权

#### 静默授权 (snsapi_base)

适用于只需要获取用户 openid 的场景，用户无感知，不会弹出授权页面。

\`\`\`
GET https://auth.activity.ioi.plus/api/oauth/authorize?app_id={项目标识}&redirect_uri={回调地址}&scope=snsapi_base
\`\`\`

#### 用户信息授权 (snsapi_userinfo)

需要用户手动确认授权，可获取用户昵称、头像等详细信息。

\`\`\`
GET https://auth.activity.ioi.plus/api/oauth/authorize?app_id={项目标识}&redirect_uri={回调地址}&scope=snsapi_userinfo
\`\`\`

**参数说明**：
- \`app_id\`: 你的项目标识
- \`redirect_uri\`: 必须经过 URL 编码，且与后台配置的回调地址完全一致
- \`scope\`: 授权类型，\`snsapi_base\` 或 \`snsapi_userinfo\`
- \`state\`: (可选) 自定义参数，授权后会原样返回

### 3. 处理回调

授权成功后，系统会重定向到你配置的回调地址，并携带以下参数：

\`\`\`
{回调地址}?code={临时授权码}&state={自定义参数}
\`\`\`

**注意**：临时授权码 \`code\` 有效期为 5 分钟，且只能使用一次。

### 4. 获取用户信息

使用临时授权码换取用户信息：

\`\`\`
GET https://auth.activity.ioi.plus/api/oauth/callback?code={临时授权码}
\`\`\`

**返回数据示例**（snsapi_userinfo）：
\`\`\`json
{
  "openid": "oABCD1234567890",
  "nickname": "张三",
  "avatar": "https://thirdwx.qlogo.cn/...",
  "sex": 1,
  "province": "广东",
  "city": "深圳",
  "country": "中国"
}
\`\`\`

**返回数据示例**（snsapi_base）：
\`\`\`json
{
  "openid": "oABCD1234567890"
}
\`\`\`

## JSSDK 配置

如需使用微信 JSSDK（分享、扫码等功能），需要获取签名配置。

### 获取签名

\`\`\`
GET https://auth.activity.ioi.plus/api/jssdk/signature?url={当前页面URL}
\`\`\`

**参数说明**：
- \`url\`: 当前页面的完整 URL（必须经过 URL 编码）

**返回数据**：
\`\`\`json
{
  "appId": "wx1234567890abcdef",
  "timestamp": 1708857600,
  "nonceStr": "abc123xyz",
  "signature": "a1b2c3d4e5f6..."
}
\`\`\`

### 前端配置示例

\`\`\`javascript
// 0. 引入微信 JSSDK (直接使用)
<script src="//res.wx.qq.com/open/js/jweixin-1.4.0.js" defer></script>

import wx from 'weixin-js-sdk'  （如果是模块化环境）

// 1. 获取签名配置
const url = encodeURIComponent(window.location.href.split('#')[0]);
const response = await fetch(\`https://auth.activity.ioi.plus/api/jssdk/signature?url=\${url}\`);
const config = await response.json();

// 2. 配置微信 JSSDK
wx.config({
  debug: false, // 生产环境设为 false
  appId: config.appId,
  timestamp: config.timestamp,
  nonceStr: config.nonceStr,
  signature: config.signature,
  jsApiList: [
    'updateAppMessageShareData',
    'updateTimelineShareData',
    'scanQRCode'
  ]
});

// 3. 配置成功后使用
wx.ready(() => {
  console.log('微信 JSSDK 配置成功');
});
\`\`\`

## 注意事项

1. **回调地址必须与配置一致**：系统会严格验证回调地址，不一致会拒绝授权
2. **临时授权码有效期**：code 有效期为 5 分钟，且只能使用一次
3. **HTTPS 要求**：生产环境必须使用 HTTPS 协议
4. **域名白名单**：确保你的域名已在微信公众平台的"网页授权域名"中配置
5. **URL 编码**：redirect_uri 参数必须经过 URL 编码
6. **项目状态**：确保项目在后台管理系统中处于"启用"状态

## 完整示例代码

### 前端 JavaScript 示例

\`\`\`javascript
// 1. 发起授权（在需要授权的页面）
function startAuth() {
  const appId = 'project1'; // 你的项目标识
  const redirectUri = encodeURIComponent('https://your-app.com/callback');
  const scope = 'snsapi_userinfo'; // 或 snsapi_base
  const state = 'custom_data'; // 可选的自定义参数

  const authUrl = \`https://auth.activity.ioi.plus/api/oauth/authorize?app_id=\${appId}&redirect_uri=\${redirectUri}&scope=\${scope}&state=\${state}\`;
  window.location.href = authUrl;
}

// 2. 处理回调（在回调页面）
async function handleCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');

  if (!code) {
    console.error('授权失败：未获取到 code');
    return;
  }

  try {
    const response = await fetch(\`https://auth.activity.ioi.plus/api/oauth/callback?code=\${code}\`);
    const userInfo = await response.json();

    console.log('用户信息：', userInfo);
    // 保存用户信息到本地存储或发送到你的后端
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  } catch (error) {
    console.error('获取用户信息失败：', error);
  }
}

// 页面加载时检查是否有 code 参数
if (window.location.search.includes('code=')) {
  handleCallback();
}
\`\`\`

### Vue.js 示例

\`\`\`javascript
// 在 Vue 组件中使用
export default {
  methods: {
    // 发起授权
    handleAuth() {
      const appId = 'project1';
      const redirectUri = encodeURIComponent(window.location.href);
      const authUrl = \`https://auth.activity.ioi.plus/api/oauth/authorize?app_id=\${appId}&redirect_uri=\${redirectUri}&scope=snsapi_userinfo\`;
      window.location.href = authUrl;
    },

    // 获取用户信息
    async getUserInfo(code) {
      const res = await this.$http.get(\`https://auth.activity.ioi.plus/api/oauth/callback?code=\${code}\`);
      return res.data;
    }
  },

  mounted() {
    const code = this.$route.query.code;
    if (code) {
      this.getUserInfo(code).then(userInfo => {
        console.log('用户信息：', userInfo);
      });
    }
  }
}
\`\`\`

## 常见问题

### Q: 授权失败怎么办？
A: 请按以下步骤排查：
1. 检查项目状态是否为"启用"
2. 确认回调地址与后台配置完全一致
3. 确认域名已在微信公众平台配置
4. 检查是否在微信内置浏览器中访问

### Q: 如何测试？
A:
1. 开发环境：使用微信开发者工具，配置测试域名
2. 生产环境：在微信内置浏览器中测试（扫码或分享链接）
3. 注意：普通浏览器无法完成微信授权流程

### Q: 支持多个回调地址吗？
A: 目前每个项目只支持一个回调地址。如需多个回调地址，可以：
1. 创建多个项目，每个项目配置不同的回调地址
2. 使用一个统一的回调地址，通过 state 参数区分不同来源

### Q: code 已使用或过期怎么办？
A: code 只能使用一次且有效期 5 分钟。如果遇到此问题：
1. 避免重复调用回调接口
2. 确保在 5 分钟内完成授权流程
3. 如果失败，需要重新发起授权

### Q: 如何判断用户是否已授权？
A:
1. snsapi_base：用户无感知，每次都会自动授权
2. snsapi_userinfo：首次需要用户确认，后续会自动授权
3. 建议在你的应用中缓存用户信息，避免频繁授权

## 技术支持

如有问题，请联系技术支持团队或查看项目文档。
`;
