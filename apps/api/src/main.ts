import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import {ValidationPipe} from '@nestjs/common';
import {shouldListenHttp} from './utils/app-mode.js';

async function bootstrap() {

  if(!shouldListenHttp()){
    console.error('main.ts requires APP_MODE=api or all');
    process.exit(1);
  }
  
  const app = await NestFactory.create(AppModule);

  const prefix = process.env.API_PREFIX ?? 'api/v1';

  const corsOrigins = process.env.CORS_ORIGINS?.split(',') ?? (process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : '');
  app.enableCors({ origin: corsOrigins, credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
