import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WechatService {
  private readonly logger = new Logger(WechatService.name);
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
    if (response.data.errcode) {
      this.logger.error(`[getAccessToken] 失败: ${response.data.errmsg} (errcode: ${response.data.errcode})`);
      throw new Error(`获取 access_token 失败: ${response.data.errmsg}`);
    }
    return response.data.access_token;
  }

  // 通过code换取网页授权access_token
  async getOAuthAccessToken(code: string) {
    const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${this.appId}&secret=${this.appSecret}&code=${code}&grant_type=authorization_code`;
    const response = await axios.get(url);
    if (response.data.errcode) {
      this.logger.error(`[getOAuthAccessToken] 失败: ${response.data.errmsg} (errcode: ${response.data.errcode})`);
      throw new Error(`微信授权失败: ${response.data.errmsg} (errcode: ${response.data.errcode})`);
    }
    this.logger.log(`[getOAuthAccessToken] 成功, openid=${response.data.openid}`);
    return response.data;
  }

  // 获取用户信息
  async getUserInfo(accessToken: string, openid: string) {
    const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openid}&lang=zh_CN`;
    const response = await axios.get(url);
    if (response.data.errcode) {
      this.logger.error(`[getUserInfo] 失败: ${response.data.errmsg} (errcode: ${response.data.errcode})`);
      throw new Error(`获取用户信息失败: ${response.data.errmsg} (errcode: ${response.data.errcode})`);
    }
    this.logger.log(`[getUserInfo] 成功, nickname=${response.data.nickname}`);
    return response.data;
  }
}
