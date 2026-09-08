import { Test, TestingModule } from '@nestjs/testing';
import { jest, expect, describe, it, beforeEach } from '@jest/globals';
import { CommentsModule } from '../comments.module.js';
import { CommentsController } from '../comments.controller.js';
import { CommentsService } from '../comments.service.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { SupabaseStorageService } from '#common/services/index.js';

describe('Comments Integration', () => {
  let controller: CommentsController;

  const mockComment = {
    id: 'int-1',
    content: 'Integration test',
    mangaId: 'm-1',
    userId: 'u-1',
  };

  const mockPrismaService = {
    db: {
      orm: {
        public: {
          User: {
            where: jest.fn().mockReturnValue({
              first: jest.fn().mockResolvedValue({ id: 'u-1', displayName: 'User 1' }),
            } as any),
          },
          Comment: {
            create: jest.fn().mockResolvedValue(mockComment),
            where: jest.fn().mockReturnValue(Promise.resolve([mockComment])),
          },
        },
      },
    },
  };

  const mockStorageService = {
    uploadFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommentsModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideProvider(SupabaseStorageService)
      .useValue(mockStorageService)
      .compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be able to fetch comments via controller which calls service', async () => {
    const result = await controller.getCommentsByManga('m-1');
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('int-1');
  });

  it('should be able to create comment', async () => {
    const authUser = { supabaseId: 'supa-123', email: 'test@test.com' };
    const result = await controller.createComment(authUser, { content: 'test', mangaId: 'm-1' });
    expect(result).toEqual(mockComment);
    expect(mockPrismaService.db.orm.public.Comment.create).toHaveBeenCalled();
  });
});
