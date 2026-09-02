import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { shouldListenHttp } from './utils/app-mode.js';

async function bootstrap() {
  if (!shouldListenHttp()) {
    console.error('main.ts requires APP_MODE=api or all');
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);

  const prefix = process.env.API_PREFIX ?? 'api/v1';

  const corsOrigins =
    process.env.CORS_ORIGINS?.split(',') ??
    (process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : '');
  app.enableCors({ origin: corsOrigins, credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('El Rincón del NiNi API')
    .setDescription('The official API documentation for El Rincón del NiNi')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/api/docs',
    apiReference({
      spec: {
        content: document,
      },
      theme: 'purple',
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
