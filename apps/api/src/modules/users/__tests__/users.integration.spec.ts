import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller.js';
import { UsersService } from '../users.service.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { SupabaseStorageService } from '#common/services/index.js';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

jest.mock('#common/decorators/current-user.decorator.js', () => ({
  CurrentUser: () => () => {},
}));

describe('Users Integration', () => {
  let controller: UsersController;

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

  const mockStorageService = {
    uploadFile: jest.fn() as any,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SupabaseStorageService, useValue: mockStorageService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateProfile (Integration)', () => {
    it('should coordinate service and storage to update profile', async () => {
      const authUser = { supabaseId: 'supa-1', email: 'test@test.com' };
      const userRecord = { id: 'user-1' };
      
      mockWhereMethods.first.mockResolvedValueOnce(userRecord); // findOrCreate user
      mockStorageService.uploadFile.mockResolvedValueOnce('https://img/prof.jpg');
      mockWhereMethods.update.mockResolvedValueOnce({ id: 'user-1', description: 'Updated bio' });

      const fakeFile = { size: 1024, originalname: 'test.jpg' } as any;

      const result = await controller.updateProfile(
        authUser,
        { description: 'Updated bio' },
        { profileImage: [fakeFile] }
      );

      expect(mockStorageService.uploadFile).toHaveBeenCalled();
      expect(mockWhereMethods.update).toHaveBeenCalledWith(expect.objectContaining({
        description: 'Updated bio',
        profileImage: 'https://img/prof.jpg',
      }));
      expect(result).toBeDefined();
    });
  });
});
