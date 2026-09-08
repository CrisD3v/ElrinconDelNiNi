import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../notifications.service.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { NotificationsGateway } from '../notifications.gateway.js';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

describe('NotificationsService', () => {
  let service: NotificationsService;

  const mockWhereMethods = {
    first: jest.fn() as any,
    update: jest.fn() as any,
    delete: jest.fn() as any,
  };

  const mockPrismaService = {
    db: {
      orm: {
        public: {
          Notification: {
            create: jest.fn() as any,
            where: (jest.fn() as any).mockReturnValue(mockWhereMethods),
          },
          User: {
            where: (jest.fn() as any).mockReturnValue(mockWhereMethods),
          },
        },
      },
    },
  };

  const mockGateway = {
    sendNotificationToUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: NotificationsGateway, useValue: mockGateway },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  describe('createMentionNotification', () => {
    it('should not notify oneself', async () => {
      const res = await service.createMentionNotification('user-1', 'user-1', 'entity-1');
      expect(res).toBeUndefined();
      expect(mockPrismaService.db.orm.public.Notification.create).not.toHaveBeenCalled();
    });

    it('should create notification and emit via gateway', async () => {
      const mockNotification = { id: 'notif-1', userId: 'user-1', actorId: 'actor-1' };
      mockPrismaService.db.orm.public.Notification.create.mockResolvedValueOnce(mockNotification);
      mockWhereMethods.first.mockResolvedValueOnce({ id: 'actor-1', username: 'actor' });

      const res = await service.createMentionNotification('user-1', 'actor-1', 'entity-1');
      
      expect(mockPrismaService.db.orm.public.Notification.create).toHaveBeenCalledWith({
        userId: 'user-1',
        actorId: 'actor-1',
        type: 'MENTION',
        entityId: 'entity-1',
      });
      expect(mockGateway.sendNotificationToUser).toHaveBeenCalledWith('user-1', expect.objectContaining({ id: 'notif-1' }));
      expect(res).toBeDefined();
    });
  });

  describe('getUserNotifications', () => {
    it('should return enriched notifications', async () => {
      const mockNotifications = [
        { id: '1', actorId: 'actor-1', createdAt: new Date('2026-01-02') },
        { id: '2', actorId: 'actor-2', createdAt: new Date('2026-01-01') },
      ];
      
      // Override where for this test specifically
      const whereMock = jest.fn() as any;
      mockPrismaService.db.orm.public.Notification.where = whereMock;
      whereMock.mockReturnValueOnce(mockNotifications);

      mockWhereMethods.first.mockResolvedValueOnce({ id: 'actor-1', username: 'actor1' });
      mockWhereMethods.first.mockResolvedValueOnce({ id: 'actor-2', username: 'actor2' });

      const res = await service.getUserNotifications('user-1');
      expect(res).toHaveLength(2);
      expect(res[0].id).toBe('1'); // Newest first
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      mockPrismaService.db.orm.public.Notification.where = jest.fn().mockReturnValue(mockWhereMethods);
      mockWhereMethods.first.mockResolvedValueOnce({ id: 'notif-1' });
      mockWhereMethods.update.mockResolvedValueOnce({ isRead: true });

      const res = await service.markAsRead('user-1', 'notif-1');
      expect(res.isRead).toBe(true);
      expect(mockWhereMethods.update).toHaveBeenCalledWith({ isRead: true });
    });
  });
});
