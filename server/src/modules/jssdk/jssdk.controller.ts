import { Controller, Get, Query } from '@nestjs/common';
import { JssdkService } from './jssdk.service';

@Controller('jssdk')
export class JssdkController {
  constructor(private jssdkService: JssdkService) {}

  @Get('signature')
  async getSignature(@Query('url') url: string) {
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
