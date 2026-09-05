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
import { CommentsService } from '../comments.service.js';
import { PrismaService } from '../../../prisma/prisma.service.js';

describe('CommentsService', () => {
  let service: CommentsService;

  const mockWhereMethods = {
    first: jest.fn() as any,
  };

  const mockCommentWhereReturn = Promise.resolve([]) as any; // Using this to mock the await on .where() directly

  const mockPrismaService = {
    db: {
      orm: {
        public: {
          User: {
            where: (jest.fn() as any).mockReturnValue(mockWhereMethods),
          },
          Comment: {
            where: (jest.fn() as any).mockReturnValue(mockCommentWhereReturn),
            create: jest.fn() as any,
          },
        },
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createComment', () => {
    const authUser = { supabaseId: 'supa-123', email: 'test@test.com' };

    it('should throw BadRequestException if neither mangaId nor chapterId is provided', async () => {
      await expect(
        service.createComment(authUser, { content: 'test' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockWhereMethods.first.mockResolvedValueOnce(null);

      await expect(
        service.createComment(authUser, {
          content: 'test',
          mangaId: 'manga-1',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should successfully create a comment for a manga', async () => {
      mockWhereMethods.first.mockResolvedValueOnce({ id: 'user-1' });
      mockPrismaService.db.orm.public.Comment.create.mockResolvedValueOnce({
        id: 'comment-1',
      });

      const result = await service.createComment(authUser, {
        content: 'Awesome manga!',
        mangaId: 'manga-1',
      });

      expect(
        mockPrismaService.db.orm.public.Comment.create,
      ).toHaveBeenCalledWith({
        userId: 'user-1',
        content: 'Awesome manga!',
        mangaId: 'manga-1',
        chapterId: null,
        imageUrl: null,
      });
      expect(result).toEqual({ id: 'comment-1' });
    });
  });

  describe('getCommentsByManga', () => {
    it('should fetch comments and map users properly', async () => {
      const fakeComments = [
        { id: 'c1', userId: 'user-1', content: 'test 1', mangaId: 'manga-1' },
        { id: 'c2', userId: 'user-2', content: 'test 2', mangaId: 'manga-1' },
        { id: 'c3', userId: 'user-1', content: 'test 3', mangaId: 'manga-1' },
      ];

      // Mock the await on `.where()` which in our code expects resolving to an array
      mockPrismaService.db.orm.public.Comment.where.mockReturnValueOnce(
        Promise.resolve(fakeComments),
      );

      // Mock users lookup
      mockWhereMethods.first
        .mockResolvedValueOnce({
          id: 'user-1',
          displayName: 'User 1',
          profileImage: 'img1',
          badges: ['READER'],
        })
        .mockResolvedValueOnce({
          id: 'user-2',
          displayName: 'User 2',
          profileImage: null,
          badges: [],
        });

      const result = await service.getCommentsByManga('manga-1');

      expect(
        mockPrismaService.db.orm.public.Comment.where,
      ).toHaveBeenCalledWith({ mangaId: 'manga-1' });
      expect(result).toHaveLength(3);
      expect(result[0].user.displayName).toBe('User 1');
      expect(result[1].user.displayName).toBe('User 2');
      expect(result[2].user.displayName).toBe('User 1');
    });
  });
});
