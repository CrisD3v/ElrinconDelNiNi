import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { jest, describe, beforeAll, afterAll, it, expect } from '@jest/globals';
import { ExecutionContext } from '@nestjs/common';
import { SupabaseAuthGuard } from '../src/modules/auth/supabase-auth.guard.js';

jest.mock('#common/decorators/current-user.decorator.js', () => ({
  CurrentUser: () => (target: any, key: string | symbol, index?: number) => {},
}));

describe('NotificationsModule (e2e)', () => {
  let app: INestApplication;
  
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
          User: {
            where: (jest.fn() as any).mockReturnValue(mockWhereMethods),
          },
        },
      },
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideGuard(SupabaseAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { supabaseId: 'user-1', email: 'user@test.com' };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('/notifications/user/:userId (GET)', async () => {
    mockPrismaService.db.orm.public.Notification.where = jest.fn().mockReturnValueOnce([
      { id: '1', actorId: 'actor-1', createdAt: new Date() }
    ]);
    mockWhereMethods.first.mockResolvedValueOnce({ id: 'actor-1', username: 'actor1' });

    const response = await request(app.getHttpServer())
      .get('/notifications/user/user-1')
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.length).toBe(1);
    expect(response.body[0].actor.username).toBe('actor1');
  });

  it('/notifications/:id/read (PATCH)', async () => {
    mockPrismaService.db.orm.public.Notification.where = jest.fn().mockReturnValue(mockWhereMethods);
    mockWhereMethods.first.mockResolvedValueOnce({ id: '1' });
    mockWhereMethods.update.mockResolvedValueOnce({ isRead: true });

    const response = await request(app.getHttpServer())
      .patch('/notifications/1/read?userId=user-1')
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.isRead).toBe(true);
  });
});
