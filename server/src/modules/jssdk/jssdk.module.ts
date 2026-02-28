import { Module } from '@nestjs/common';
import { JssdkController } from './jssdk.controller';
import { JssdkService } from './jssdk.service';
import Redis from 'ioredis';

@Module({
  controllers: [JssdkController],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          password: process.env.REDIS_PASSWORD || undefined,
          db: parseInt(process.env.REDIS_DB || '0'),
        });
      },
    },
    JssdkService,
  ],
})
export class JssdkModule {}
