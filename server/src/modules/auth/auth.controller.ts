import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('oauth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 发起授权
  @Get('authorize')
  async authorize(
    @Query('appId') appId: string,
    @Query('redirect') redirect: string,
    @Query('scope') scope: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    try {
      // 构造state参数
      const stateData = {
        appId,
        redirect,
        scope: scope || 'snsapi_base',
        state: state || '',
      };
      const encodedState = Buffer.from(JSON.stringify(stateData)).toString('base64');

      // 生成微信授权URL
      const authUrl = await this.authService.generateAuthUrl(
        appId,
        redirect,
        scope || 'snsapi_base',
        encodedState,
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
    @Res() res: Response,
  ) {
    try {
      const result = await this.authService.handleCallback(code, state);

      // 重定向回业务项目
      const redirectUrl = `${result.redirect}?token=${result.token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
