import { Module } from '@nestjs/common';
import { JssdkController } from './jssdk.controller';
import { JssdkService } from './jssdk.service';

@Module({
  controllers: [JssdkController],
  providers: [JssdkService],
})
export class JssdkModule {}
