import { Module } from '@nestjs/common';
import { AuthModule } from '#modules/auth/index.js';
import { StorageModule } from '#common/services/storage.module.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { CommentsController } from './comments.controller.js';
import { CommentsService } from './comments.service.js';

@Module({
  imports: [AuthModule, PrismaModule, StorageModule],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
