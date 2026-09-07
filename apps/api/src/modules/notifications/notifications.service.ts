import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { NotificationsGateway } from './notifications.gateway.js';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private gateway: NotificationsGateway,
  ) {}

  private async toArray<T>(iterable: any): Promise<T[]> {
    if (Array.isArray(iterable)) return iterable;
    if (!iterable) return [];
    if (typeof iterable.all === 'function') return iterable.all();
    if (typeof iterable.many === 'function') return iterable.many();
    const result: T[] = [];
    if (typeof iterable[Symbol.asyncIterator] === 'function') {
      for await (const item of iterable) result.push(item);
      return result;
    }
    if (typeof iterable[Symbol.iterator] === 'function') {
      for (const item of iterable) result.push(item);
      return result;
    }
    return [iterable as T];
  }

  async createMentionNotification(
    userId: string,
    actorId: string,
    entityId: string,
  ) {
    if (userId === actorId) return; // Don't notify oneself

    try {
      const notification = await this.prisma.db.orm.public.Notification.create({
        userId,
        actorId,
        type: 'MENTION',
        entityId,
      });

      // Fetch actor details manually
      const actor = await this.prisma.db.orm.public.User.where({ id: actorId }).first();
      const enrichedNotification = {
        ...notification,
        actor: actor ? {
          id: actor.id,
          username: actor.username,
          displayName: actor.displayName,
          profileImage: actor.profileImage,
        } : null,
      };

      // Emit to WebSocket
      this.gateway.sendNotificationToUser(userId, enrichedNotification);

      return enrichedNotification;
    } catch (error) {
      this.logger.error('Error creating mention notification', error);
    }
  }

  async getUserNotifications(userId: string, limit = 20) {
    const notifications: any[] = await this.toArray(
      await this.prisma.db.orm.public.Notification.where({ userId })
    );
    // Sort by descending createdAt (newest first) manually since prisma-next might not support orderBy
    const getMs = (date: any) => {
      if (!date) return 0;
      if (typeof date.epochMilliseconds === 'number') return date.epochMilliseconds;
      return new Date(String(date)).getTime();
    };
    notifications.sort((a: any, b: any) => getMs(b.createdAt) - getMs(a.createdAt));
    const limited = notifications.slice(0, limit);

    // Enrich with actor data
    const enriched = await Promise.all(
      limited.map(async (n: any) => {
        const actor = await this.prisma.db.orm.public.User.where({ id: n.actorId }).first();
        return {
          ...n,
          actor: actor ? {
            id: actor.id,
            username: actor.username,
            displayName: actor.displayName,
            profileImage: actor.profileImage,
          } : null,
        };
      })
    );
    return enriched;
  }

  async markAsRead(userId: string, notificationId: string): Promise<any> {
    const notification = await this.prisma.db.orm.public.Notification.where({ id: notificationId, userId }).first();
    if (notification) {
      await this.prisma.db.orm.public.Notification.where({ id: notificationId }).update({ isRead: true });
      notification.isRead = true;
    }
    return notification;
  }

  async markAllAsRead(userId: string) {
    const notifications: any[] = await this.toArray(
      await this.prisma.db.orm.public.Notification.where({ userId, isRead: false })
    );
    for (const n of notifications) {
      await this.prisma.db.orm.public.Notification.where({ id: n.id }).update({ isRead: true });
    }
    return { count: notifications.length };
  }

  async markAsUnread(userId: string, notificationId: string): Promise<any> {
    const notification = await this.prisma.db.orm.public.Notification.where({ id: notificationId, userId }).first();
    if (notification) {
      await this.prisma.db.orm.public.Notification.where({ id: notificationId }).update({ isRead: false });
      notification.isRead = false;
    }
    return notification;
  }

  async deleteNotification(userId: string, notificationId: string): Promise<any> {
    const notification = await this.prisma.db.orm.public.Notification.where({ id: notificationId, userId }).first();
    if (notification) {
      await this.prisma.db.orm.public.Notification.where({ id: notificationId }).delete();
    }
    return { success: true };
  }

  async deleteAllNotifications(userId: string) {
    const notifications: any[] = await this.toArray(
      await this.prisma.db.orm.public.Notification.where({ userId })
    );
    for (const n of notifications) {
      await this.prisma.db.orm.public.Notification.where({ id: n.id }).delete();
    }
    return { count: notifications.length };
  }
}
