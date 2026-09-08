import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from '../notifications.controller.js';
import { NotificationsService } from '../notifications.service.js';
import { NotificationsGateway } from '../notifications.gateway.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

describe('Notifications Integration', () => {
  let controller: NotificationsController;

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
      controllers: [NotificationsController],
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: NotificationsGateway, useValue: mockGateway },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('controller should call service which queries prisma', async () => {
    mockPrismaService.db.orm.public.Notification.where = jest.fn().mockReturnValue(mockWhereMethods);
    mockWhereMethods.first.mockResolvedValueOnce({ id: 'notif-1' });
    mockWhereMethods.update.mockResolvedValueOnce({ isRead: true });

    const result = await controller.markAsRead('notif-1', 'user-1');
    expect(result.isRead).toBe(true);
    expect(mockWhereMethods.update).toHaveBeenCalledWith({ isRead: true });
  });
});
