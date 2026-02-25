import { Controller, Post, Body } from '@nestjs/common';
import { JssdkService } from './jssdk.service';

@Controller('api/jssdk')
export class JssdkController {
  constructor(private jssdkService: JssdkService) {}

  @Post('signature')
  async getSignature(@Body('url') url: string) {
    try {
      const signature = await this.jssdkService.generateSignature(url);
      return {
        success: true,
        data: signature,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
