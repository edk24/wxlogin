import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('oauth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 发起授权
  @Get('authorize')
  async authorize(
    @Query('app_id') appId: string,
    @Query('redirect_uri') redirect: string,
    @Query('scope') scope: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    try {
      // 构造完整的state数据
      const stateData = {
        appId,
        redirect,
        scope: scope || 'snsapi_base',
        state: state || '',
      };

      // 保存到Redis，获取短ID
      const stateId = await this.authService.saveStateData(stateData);

      // 生成微信授权URL（只传递短ID）
      const authUrl = await this.authService.generateAuthUrl(
        appId,
        redirect,
        scope || 'snsapi_base',
        stateId,
      );

      // 重定向到微信授权页面
      res.redirect(authUrl);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // 微信回调
  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Query('state') stateId: string,
    @Res() res: Response,
  ) {
    try {
      // 从Redis获取完整的state数据
      const stateData = await this.authService.getStateData(stateId);

      // 使用stateData处理回调
      const result = await this.authService.handleCallback(code, stateData);

      // 构造URL参数
      const params = new URLSearchParams();
      params.append('openid', result.openid);

      if (result.nickname) {
        params.append('nickname', result.nickname);
      }
      if (result.avatar) {
        params.append('avatar', result.avatar);
      }
      if (result.sex) {
        params.append('sex', result.sex.toString());
      }
      if (result.state) {
        params.append('state', result.state);
      }

      // 重定向回业务项目，携带用户信息
      const separator = result.redirect.includes('?') ? '&' : '?';
      const redirectUrl = `${result.redirect}${separator}${params.toString()}`;
      res.redirect(redirectUrl);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
