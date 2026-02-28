import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import Redis from 'ioredis';

@Injectable()
export class JssdkService {
  private appId: string;
  private appSecret: string;

  constructor(
    private configService: ConfigService,
    @Inject('REDIS_CLIENT') private redis: Redis,
  ) {
    this.appId = this.configService.get('wechat.appId');
    this.appSecret = this.configService.get('wechat.appSecret');
  }

  // 获取access_token
  async getAccessToken(): Promise<string> {
    const cacheKey = `wechat:access_token:${this.appId}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.appId}&secret=${this.appSecret}`;
    const response = await axios.get(url);

    if (response.data.errcode) {
      throw new Error(`获取access_token失败: ${response.data.errmsg} (errcode: ${response.data.errcode})`);
    }

    const accessToken = response.data.access_token;
    if (!accessToken) {
      throw new Error('access_token为空');
    }

    await this.redis.setex(cacheKey, 7000, accessToken);
    return accessToken;
  }

  // 获取jsapi_ticket
  async getJsapiTicket(): Promise<string> {
    const cacheKey = `wechat:jsapi_ticket:${this.appId}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const accessToken = await this.getAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`;
    const response = await axios.get(url);

    if (response.data.errcode && response.data.errcode !== 0) {
      throw new Error(`获取jsapi_ticket失败: ${response.data.errmsg} (errcode: ${response.data.errcode})`);
    }

    const ticket = response.data.ticket;
    if (!ticket) {
      throw new Error('jsapi_ticket为空');
    }

    await this.redis.setex(cacheKey, 7000, ticket);
    return ticket;
  }

  // 生成签名
  async generateSignature(url: string) {
    const ticket = await this.getJsapiTicket();
    const nonceStr = this.createNonceStr();
    const timestamp = Math.floor(Date.now() / 1000);

    // 移除 URL 中的 # 及其后面部分
    const cleanUrl = url.split('#')[0];

    const string = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${cleanUrl}`;
    const signature = crypto.createHash('sha1').update(string).digest('hex');

    return {
      appId: this.appId,
      timestamp,
      nonceStr,
      signature
    };
  }

  // 生成随机字符串
  private createNonceStr(): string {
    return Math.random().toString(36).substr(2, 15);
  }
}
