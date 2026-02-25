import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class JssdkService {
  private appId: string;
  private appSecret: string;

  constructor(private configService: ConfigService) {
    this.appId = this.configService.get('wechat.appId');
    this.appSecret = this.configService.get('wechat.appSecret');
  }

  // 获取access_token
  async getAccessToken(): Promise<string> {
    // TODO: 从Redis缓存中获取，如果不存在则请求微信API
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.appId}&secret=${this.appSecret}`;
    const response = await axios.get(url);
    return response.data.access_token;
  }

  // 获取jsapi_ticket
  async getJsapiTicket(): Promise<string> {
    // TODO: 从Redis缓存中获取，如果不存在则请求微信API
    const accessToken = await this.getAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`;
    const response = await axios.get(url);
    return response.data.ticket;
  }

  // 生成签名
  async generateSignature(url: string) {
    const ticket = await this.getJsapiTicket();
    const nonceStr = this.createNonceStr();
    const timestamp = Math.floor(Date.now() / 1000);

    const string = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
    const signature = crypto.createHash('sha1').update(string).digest('hex');

    return {
      appId: this.appId,
      timestamp,
      nonceStr,
      signature,
    };
  }

  // 生成随机字符串
  private createNonceStr(): string {
    return Math.random().toString(36).substr(2, 15);
  }
}
