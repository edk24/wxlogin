import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { ProjectModule } from './modules/project/project.module';
import { UserModule } from './modules/user/user.module';
import { LogModule } from './modules/log/log.module';
import { AuthModule } from './modules/auth/auth.module';
import { JssdkModule } from './modules/jssdk/jssdk.module';
import { AdminModule } from './modules/admin/admin.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => {
        const host = process.env.REDIS_HOST || 'localhost';
        const port = process.env.REDIS_PORT || '6379';
        const password = process.env.REDIS_PASSWORD;
        const db = process.env.REDIS_DB || '0';
        const auth = password ? `:${password}@` : '';
        const redisUrl = `redis://${auth}${host}:${port}/${db}`;

        return {
          stores: [new KeyvRedis(redisUrl)],
          ttl: 300_000, // 默认5分钟（毫秒，cache-manager v7 使用毫秒）
        };
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'wxlogin',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // 生产环境应设为false
    }),
    ProjectModule,
    UserModule,
    LogModule,
    AuthModule,
    JssdkModule,
    AdminModule,
  ],
})
export class AppModule {}
