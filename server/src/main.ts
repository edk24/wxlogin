import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(3000);
  console.log(`应用已启动，监听端口: 3000`);
}

bootstrap();
