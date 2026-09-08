import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { SeriesModule } from './modules/series/series.module.js';
import { CommentsModule } from './modules/comments/comments.module.js';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { AppController } from './app.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    SeriesModule,
    CommentsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
