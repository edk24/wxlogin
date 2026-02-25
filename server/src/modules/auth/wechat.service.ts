import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WechatService {
  private appId: string;
  private appSecret: string;

  constructor(private configService: ConfigService) {
    this.appId = this.configService.get('wechat.appId');
    this.appSecret = this.configService.get('wechat.appSecret');
  }

  // 获取access_token
  async getAccessToken(): Promise<string> {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.appId}&secret=${this.appSecret}`;
    const response = await axios.get(url);
    return response.data.access_token;
  }

  // 通过code换取网页授权access_token
  async getOAuthAccessToken(code: string) {
    const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${this.appId}&secret=${this.appSecret}&code=${code}&grant_type=authorization_code`;
    const response = await axios.get(url);
    return response.data;
  }

  // 获取用户信息
  async getUserInfo(accessToken: string, openid: string) {
    const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openid}&lang=zh_CN`;
    const response = await axios.get(url);
    return response.data;
  }
}
