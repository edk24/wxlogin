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
      // 生成微信授权URL，state 透传不做缓存
      const authUrl = await this.authService.generateAuthUrl(
        appId,
        redirect,
        scope || 'snsapi_base',
        state || '',
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
    @Query('state') state: string,
    @Query('app_id') appId: string,
    @Query('redirect_uri') redirect: string,
    @Query('scope') scope: string,
    @Res() res: Response,
  ) {
    try {
      // 使用stateData处理回调
      const result = await this.authService.handleCallback(code, {
        appId,
        redirect,
        scope: scope || 'snsapi_base',
        state: state || '',
      });

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
