import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PORT || '3000', 10);

  // 启用CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // 设置全局API前缀
  app.setGlobalPrefix('api');

  await app.listen(port, '0.0.0.0');
  console.log(`应用已启动，监听端口: ${port}`);
}

bootstrap();
