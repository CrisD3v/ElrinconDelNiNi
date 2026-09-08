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

describe('UsersModule (e2e)', () => {
  let app: INestApplication;
  
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
          req.user = { supabaseId: 'supa-user-1', email: 'user1@test.com' };
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

  it('/users/profile (PATCH)', async () => {
    // findOrCreate mock
    mockWhereMethods.first.mockResolvedValueOnce({ id: 'user-1' });
    // update mock
    mockWhereMethods.update.mockResolvedValueOnce({ success: true });

    const response = await request(app.getHttpServer())
      .patch('/users/profile')
      .send({
        description: 'New Description',
        displayName: 'New Display Name',
      })
      .expect(200);

    expect(response.body).toBeDefined();
  });

  it('/users/:id/follow (POST)', async () => {
    // findOrCreate mock
    mockWhereMethods.first.mockResolvedValueOnce({ id: 'user-1' });
    // following user exists mock
    mockWhereMethods.first.mockResolvedValueOnce({ id: 'user-2' });
    // not already following
    mockWhereMethods.first.mockResolvedValueOnce(null);
    // create follow
    mockPrismaService.db.orm.public.Follow.create.mockResolvedValueOnce({ id: 'follow-1' });

    const response = await request(app.getHttpServer())
      .post('/users/user-2/follow')
      .expect(201);

    expect(response.body).toEqual({ id: 'follow-1' });
  });

  it('/users/:id/follow (DELETE)', async () => {
    // findOrCreate mock
    mockWhereMethods.first.mockResolvedValueOnce({ id: 'user-1' });
    // follow exists
    mockWhereMethods.first.mockResolvedValueOnce({ id: 'follow-1' });
    mockWhereMethods.delete.mockResolvedValueOnce({ success: true });

    const response = await request(app.getHttpServer())
      .delete('/users/user-2/follow')
      .expect(200);

    expect(response.body).toEqual({ success: true });
  });
});
