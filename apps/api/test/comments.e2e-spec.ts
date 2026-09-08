import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { jest, expect, describe, it, beforeAll, afterAll } from '@jest/globals';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { SupabaseStorageService } from '#common/services/index.js';

describe('CommentsController (e2e)', () => {
  let app: INestApplication;

  const mockCommentCreateReturn = {
    id: 'comment-e2e-1',
    content: 'E2E test comment',
    mangaId: 'manga-1',
    chapterId: null,
    userId: 'user-1',
    imageUrl: null,
    isSpoiler: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    db: {
      orm: {
        public: {
          User: {
            where: jest.fn().mockReturnValue({
              first: jest.fn().mockResolvedValue({ id: 'user-1' }),
            } as any),
          },
          Comment: {
            create: jest.fn().mockResolvedValue(mockCommentCreateReturn),
            where: jest.fn().mockReturnValue(Promise.resolve([mockCommentCreateReturn])),
          },
        },
      },
    },
  };

  const mockStorageService = {
    uploadFile: jest.fn().mockResolvedValue('https://fake-url.com/image.jpg'),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideProvider(SupabaseStorageService)
      .useValue(mockStorageService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/comments (POST)', () => {
    it('should return 401 if unauthorized', async () => {
      // Assuming AuthGuard protects this route, supertest without token should fail
      return request(app.getHttpServer())
        .post('/comments')
        .send({ content: 'Test', mangaId: 'manga-1' })
        .expect(401);
    });

    // Normally we would mock the Supabase Auth guard or inject a token, 
    // but to keep this e2e test focused, if we haven't mocked AuthGuard,
    // we just test the unauthorized case to ensure guards are applied.
    // If we want to test success, we would need to mock the JwtAuthGuard or SupabaseGuard.
  });

  describe('/comments/manga/:mangaId (GET)', () => {
    it('should return a list of comments', async () => {
      const response = await request(app.getHttpServer())
        .get('/comments/manga/manga-1')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe('comment-e2e-1');
    });
  });
});
