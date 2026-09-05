/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { jest, expect, describe, it, beforeEach } from '@jest/globals';
import { UsersController } from '../users.controller.js';
import { UsersService } from '../users.service.js';
import { SupabaseStorageService } from '#common/services/index.js';

jest.mock('#common/decorators/index.js', () => ({
  CurrentUser: () => () => {},
}));

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    findOrCreate: jest.fn() as any,
    updateProfile: jest.fn() as any,
    follow: jest.fn() as any,
    unfollow: jest.fn() as any,
    getFollowers: jest.fn() as any,
    getFollowing: jest.fn() as any,
  };

  const mockStorageService = {
    uploadFile: jest.fn() as any,
  };

  beforeEach(async () => {
    // Reset env vars before each test to guarantee isolated behavior
    process.env.MAX_PROFILE_IMAGE_SIZE_MB = '5';
    process.env.MAX_BANNER_IMAGE_SIZE_MB = '5';

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: SupabaseStorageService, useValue: mockStorageService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('updateProfile', () => {
    const authUser = {
      supabaseId: 'supa-123',
      email: 'test@test.com',
      displayName: 'Test User',
    };
    const mockUser = { id: 'user-1', profileImage: null, bannerImage: null };

    it('should throw BadRequestException if profile image exceeds max size', async () => {
      mockUsersService.findOrCreate.mockResolvedValueOnce(mockUser);

      const overSizedFile = { size: 6 * 1024 * 1024 } as any; // 6MB

      await expect(
        controller.updateProfile(
          authUser,
          {},
          { profileImage: [overSizedFile] },
        ),
      ).rejects.toThrow(BadRequestException);

      expect(mockStorageService.uploadFile).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if banner image exceeds max size', async () => {
      mockUsersService.findOrCreate.mockResolvedValueOnce(mockUser);

      const overSizedFile = { size: 6 * 1024 * 1024 } as any; // 6MB

      await expect(
        controller.updateProfile(
          authUser,
          {},
          { bannerImage: [overSizedFile] },
        ),
      ).rejects.toThrow(BadRequestException);

      expect(mockStorageService.uploadFile).not.toHaveBeenCalled();
    });

    it('should successfully upload valid images and update profile', async () => {
      mockUsersService.findOrCreate.mockResolvedValueOnce(mockUser);
      mockStorageService.uploadFile.mockResolvedValueOnce(
        'https://storage/profile.jpg',
      );
      mockStorageService.uploadFile.mockResolvedValueOnce(
        'https://storage/banner.jpg',
      );
      mockUsersService.updateProfile.mockResolvedValueOnce({ success: true });

      const validProfileFile = { size: 1024 } as any;
      const validBannerFile = { size: 2048 } as any;

      const result = await controller.updateProfile(
        authUser,
        { description: 'Hello world' },
        { profileImage: [validProfileFile], bannerImage: [validBannerFile] },
      );

      expect(mockStorageService.uploadFile).toHaveBeenCalledTimes(2);
      expect(mockUsersService.updateProfile).toHaveBeenCalledWith('user-1', {
        description: 'Hello world',
        displayName: undefined,
        profileImage: 'https://storage/profile.jpg',
        bannerImage: 'https://storage/banner.jpg',
      });
      expect(result).toEqual({ success: true });
    });
  });

  describe('followUser', () => {
    it('should call usersService.follow', async () => {
      const authUser = { supabaseId: 'supa-123', email: 'a@a.com' };
      mockUsersService.findOrCreate.mockResolvedValueOnce({ id: 'user-1' });
      mockUsersService.follow.mockResolvedValueOnce({ id: 'follow-1' });

      const result = await controller.followUser(authUser, 'user-2');
      expect(mockUsersService.follow).toHaveBeenCalledWith('user-1', 'user-2');
      expect(result).toEqual({ id: 'follow-1' });
    });
  });
});
