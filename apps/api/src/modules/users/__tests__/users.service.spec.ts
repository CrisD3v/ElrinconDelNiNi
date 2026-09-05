/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  jest,
  expect,
  describe,
  it,
  beforeEach,
  afterEach,
} from '@jest/globals';
import { UsersService } from '../users.service.js';
import { PrismaService } from '../../../prisma/prisma.service.js';

describe('UsersService', () => {
  let service: UsersService;

  const mockWhereMethods = {
    first: jest.fn() as any,
    update: jest.fn() as any,
    many: jest.fn() as any,
    delete: jest.fn() as any,
  };

  const mockPrismaService = {
    db: {
      orm: {
        public: {
          User: {
            where: (jest.fn() as any).mockReturnValue(mockWhereMethods),
            create: jest.fn() as any,
          },
          Follow: {
            where: (jest.fn() as any).mockReturnValue(mockWhereMethods),
            create: jest.fn() as any,
          },
        },
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOrCreate', () => {
    const authUser = {
      supabaseId: 'supa-123',
      email: 'test@test.com',
      displayName: 'Test User',
    };

    it('should return existing user without updating if display name has not changed', async () => {
      const existingUser = {
        id: 'user-1',
        supabaseId: 'supa-123',
        displayName: 'Test User',
      };
      mockWhereMethods.first.mockResolvedValueOnce(existingUser);

      const result = await service.findOrCreate(authUser);
      expect(result).toEqual(existingUser);
      expect(mockWhereMethods.update).not.toHaveBeenCalled();
    });

    it('should update display name if it has changed', async () => {
      const existingUser = {
        id: 'user-1',
        supabaseId: 'supa-123',
        displayName: 'Old Name',
      };
      const updatedUser = { ...existingUser, displayName: 'Test User' };

      mockWhereMethods.first.mockResolvedValueOnce(existingUser);
      mockWhereMethods.update.mockResolvedValueOnce(updatedUser);

      const result = await service.findOrCreate(authUser);

      expect(mockPrismaService.db.orm.public.User.where).toHaveBeenCalledWith({
        id: 'user-1',
      });
      expect(mockWhereMethods.update).toHaveBeenCalledWith({
        displayName: 'Test User',
      });
      expect(result).toEqual(updatedUser);
    });

    it('should create a new user if one does not exist', async () => {
      mockWhereMethods.first.mockResolvedValueOnce(null);
      const newUser = { id: 'new-user-1', ...authUser, badges: ['READER'] };
      mockPrismaService.db.orm.public.User.create.mockResolvedValueOnce(
        newUser,
      );

      const result = await service.findOrCreate(authUser);

      expect(mockPrismaService.db.orm.public.User.create).toHaveBeenCalledWith({
        supabaseId: authUser.supabaseId,
        email: authUser.email,
        displayName: authUser.displayName,
        badges: ['READER'],
      });
      expect(result).toEqual(newUser);
    });
  });

  describe('follow', () => {
    it('should throw BadRequestException when trying to follow oneself', async () => {
      await expect(service.follow('user-1', 'user-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if followingId user does not exist', async () => {
      mockWhereMethods.first.mockResolvedValueOnce(null); // followingUser lookup
      await expect(service.follow('user-1', 'user-2')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return existing follow relationship if it already exists', async () => {
      const followingUser = { id: 'user-2' };
      const existingFollow = {
        id: 'follow-1',
        followerId: 'user-1',
        followingId: 'user-2',
      };

      // first call: followingUser lookup
      mockWhereMethods.first.mockResolvedValueOnce(followingUser);
      // second call: existing follow lookup
      mockWhereMethods.first.mockResolvedValueOnce(existingFollow);

      const result = await service.follow('user-1', 'user-2');
      expect(result).toEqual(existingFollow);
      expect(
        mockPrismaService.db.orm.public.Follow.create,
      ).not.toHaveBeenCalled();
    });

    it('should create a new follow relationship', async () => {
      const followingUser = { id: 'user-2' };
      const newFollow = {
        id: 'follow-new',
        followerId: 'user-1',
        followingId: 'user-2',
      };

      mockWhereMethods.first.mockResolvedValueOnce(followingUser);
      mockWhereMethods.first.mockResolvedValueOnce(null); // no existing follow
      mockPrismaService.db.orm.public.Follow.create.mockResolvedValueOnce(
        newFollow,
      );

      const result = await service.follow('user-1', 'user-2');
      expect(result).toEqual(newFollow);
    });
  });

  describe('unfollow', () => {
    it('should delete the follow relationship if it exists', async () => {
      const existingFollow = {
        id: 'follow-1',
        followerId: 'user-1',
        followingId: 'user-2',
      };
      mockWhereMethods.first.mockResolvedValueOnce(existingFollow);
      mockWhereMethods.delete.mockResolvedValueOnce(true);

      const result = await service.unfollow('user-1', 'user-2');
      expect(result).toEqual({ success: true });
      expect(mockPrismaService.db.orm.public.Follow.where).toHaveBeenCalledWith(
        { id: 'follow-1' },
      );
      expect(mockWhereMethods.delete).toHaveBeenCalled();
    });

    it('should do nothing and return success if relationship does not exist', async () => {
      mockWhereMethods.first.mockResolvedValueOnce(null);
      const result = await service.unfollow('user-1', 'user-2');

      expect(result).toEqual({ success: true });
      expect(mockWhereMethods.delete).not.toHaveBeenCalled();
    });
  });

  describe('updateProfile', () => {
    it('should update profile with provided fields', async () => {
      const updatedUser = {
        id: 'user-1',
        description: 'New Description',
        displayName: 'New Name',
      };
      mockWhereMethods.update.mockResolvedValueOnce(updatedUser);

      const result = await service.updateProfile('user-1', {
        description: 'New Description',
        displayName: 'New Name',
      });

      expect(mockPrismaService.db.orm.public.User.where).toHaveBeenCalledWith({
        id: 'user-1',
      });
      expect(mockWhereMethods.update).toHaveBeenCalledWith({
        description: 'New Description',
        displayName: 'New Name',
      });
      expect(result).toEqual(updatedUser);
    });
  });
});
