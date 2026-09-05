import './polyfill.js';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { getAppMode, shouldRunWorkers } from './utils/app-mode.js';

async function bootstrap() {
  const logger = new Logger('WorkerBootstrap');

  if (!shouldRunWorkers()) {
    logger.error('worker.ts requires APP_MODE=worker or all');
    process.exit(1);
  }

  await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  logger.log(`BullMQ workers running (APP_MODE=${getAppMode()})`);
}

bootstrap();
