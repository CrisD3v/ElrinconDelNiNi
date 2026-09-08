import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from '../notifications.controller.js';
import { NotificationsService } from '../notifications.service.js';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  const mockService = {
    getUserNotifications: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
    markAsUnread: jest.fn(),
    deleteAllNotifications: jest.fn(),
    deleteNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should call getUserNotifications with limit', async () => {
    mockService.getUserNotifications.mockResolvedValueOnce([]);
    const res = await controller.getUserNotifications('user-1', '10');
    expect(mockService.getUserNotifications).toHaveBeenCalledWith('user-1', 10);
    expect(res).toEqual([]);
  });

  it('should call markAsRead', async () => {
    mockService.markAsRead.mockResolvedValueOnce({ id: 'notif-1' });
    const res = await controller.markAsRead('notif-1', 'user-1');
    expect(mockService.markAsRead).toHaveBeenCalledWith('user-1', 'notif-1');
    expect(res).toEqual({ id: 'notif-1' });
  });

  it('should call markAllAsRead', async () => {
    mockService.markAllAsRead.mockResolvedValueOnce({ count: 5 });
    const res = await controller.markAllAsRead('user-1');
    expect(mockService.markAllAsRead).toHaveBeenCalledWith('user-1');
    expect(res).toEqual({ count: 5 });
  });

  it('should call markAsUnread', async () => {
    mockService.markAsUnread.mockResolvedValueOnce({ id: 'notif-1' });
    const res = await controller.markAsUnread('notif-1', 'user-1');
    expect(mockService.markAsUnread).toHaveBeenCalledWith('user-1', 'notif-1');
    expect(res).toEqual({ id: 'notif-1' });
  });

  it('should call deleteNotification', async () => {
    mockService.deleteNotification.mockResolvedValueOnce({ success: true });
    const res = await controller.deleteNotification('notif-1', 'user-1');
    expect(mockService.deleteNotification).toHaveBeenCalledWith('user-1', 'notif-1');
    expect(res).toEqual({ success: true });
  });

  it('should call deleteAllNotifications', async () => {
    mockService.deleteAllNotifications.mockResolvedValueOnce({ count: 5 });
    const res = await controller.deleteAllNotifications('user-1');
    expect(mockService.deleteAllNotifications).toHaveBeenCalledWith('user-1');
    expect(res).toEqual({ count: 5 });
  });
});
