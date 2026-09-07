import { Controller, Get, Param, Patch, Query, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('user/:userId')
  async getUserNotifications(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    const l = limit ? parseInt(limit, 10) : 20;
    return this.notificationsService.getUserNotifications(userId, l);
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') notificationId: string,
    @Query('userId') userId: string,
  ): Promise<any> {
    return this.notificationsService.markAsRead(userId, notificationId);
  }

  @Patch('read-all')
  async markAllAsRead(@Query('userId') userId: string): Promise<any> {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Patch(':id/unread')
  async markAsUnread(
    @Param('id') notificationId: string,
    @Query('userId') userId: string,
  ): Promise<any> {
    return this.notificationsService.markAsUnread(userId, notificationId);
  }

  @Delete('user/all')
  async deleteAllNotifications(@Query('userId') userId: string): Promise<any> {
    return this.notificationsService.deleteAllNotifications(userId);
  }

  @Delete(':id')
  async deleteNotification(
    @Param('id') notificationId: string,
    @Query('userId') userId: string,
  ): Promise<any> {
    return this.notificationsService.deleteNotification(userId, notificationId);
  }
}
