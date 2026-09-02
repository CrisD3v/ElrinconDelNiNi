/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { jest, expect, describe, it, beforeEach } from '@jest/globals';
import { CommentsController } from '../comments.controller.js';
import { CommentsService } from '../comments.service.js';
import { SupabaseStorageService } from '#common/services/index.js';

jest.mock('#common/decorators/index.js', () => ({
  CurrentUser: () => () => {},
}));

describe('CommentsController', () => {
  let controller: CommentsController;

  const mockCommentsService = {
    createComment: jest.fn() as any,
    getCommentsByManga: jest.fn() as any,
    getCommentsByChapter: jest.fn() as any,
  };

  const mockStorageService = {
    uploadFile: jest.fn() as any,
  };

  beforeEach(async () => {
    process.env.MAX_COMMENTS_IMAGES_SIZE_MB = '5';

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        { provide: CommentsService, useValue: mockCommentsService },
        { provide: SupabaseStorageService, useValue: mockStorageService },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  describe('createComment', () => {
    const authUser = { supabaseId: 'supa-123', email: 'test@test.com' };

    it('should throw BadRequestException if image exceeds max size', async () => {
      const overSizedFile = { size: 6 * 1024 * 1024 } as any; // 6MB

      await expect(
        controller.createComment(
          authUser,
          { content: 'test', mangaId: 'm1' },
          overSizedFile,
        ),
      ).rejects.toThrow(BadRequestException);

      expect(mockStorageService.uploadFile).not.toHaveBeenCalled();
    });

    it('should upload valid image and call service', async () => {
      const validFile = { size: 1024 } as any;
      mockStorageService.uploadFile.mockResolvedValueOnce(
        'https://storage/comment.jpg',
      );
      mockCommentsService.createComment.mockResolvedValueOnce({ id: 'c1' });

      const result = await controller.createComment(
        authUser,
        { content: 'test', chapterId: 'ch1' },
        validFile,
      );

      expect(mockStorageService.uploadFile).toHaveBeenCalled();
      expect(mockCommentsService.createComment).toHaveBeenCalledWith(authUser, {
        content: 'test',
        chapterId: 'ch1',
        imageUrl: 'https://storage/comment.jpg',
      });
      expect(result).toEqual({ id: 'c1' });
    });

    it('should call service without image if no file provided', async () => {
      mockCommentsService.createComment.mockResolvedValueOnce({ id: 'c2' });

      const result = await controller.createComment(authUser, {
        content: 'test',
        mangaId: 'm1',
      });

      expect(mockStorageService.uploadFile).not.toHaveBeenCalled();
      expect(mockCommentsService.createComment).toHaveBeenCalledWith(authUser, {
        content: 'test',
        mangaId: 'm1',
        imageUrl: null,
      });
      expect(result).toEqual({ id: 'c2' });
    });
  });
});
