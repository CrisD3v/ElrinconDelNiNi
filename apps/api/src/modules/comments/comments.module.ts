import { Module } from '@nestjs/common';
import { AuthModule } from '#modules/auth/index.js';
import { StorageModule } from '#common/services/storage.module.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { CommentsController } from './comments.controller.js';
import { CommentsService } from './comments.service.js';
import { CommentsGateway } from './comments.gateway.js';

@Module({
  imports: [AuthModule, PrismaModule, StorageModule, NotificationsModule],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsGateway],
  exports: [CommentsService, CommentsGateway],
})
export class CommentsModule {}
