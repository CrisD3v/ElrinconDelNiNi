import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service.js';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

describe('AuthService', () => {
  let service: AuthService;
  let mockSupabaseAuth: any;

  beforeEach(async () => {
    const mockConfigService = {
      getOrThrow: jest.fn((key: string) => {
        if (key === 'SUPABASE_URL') return 'http://localhost:54321';
        if (key === 'SUPABASE_SERVICE_ROLE_KEY') return 'mock-key';
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockSupabaseAuth = { getUser: jest.fn() };
    (service as any).supabase = { auth: mockSupabaseAuth };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verifyToken', () => {
    it('should throw UnauthorizedException if supabase returns an error', async () => {
      mockSupabaseAuth.getUser.mockResolvedValueOnce({ error: new Error('Invalid token'), data: { user: null } });
      await expect(service.verifyToken('bad-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user email is missing', async () => {
      mockSupabaseAuth.getUser.mockResolvedValueOnce({ error: null, data: { user: { id: '1' } } });
      await expect(service.verifyToken('bad-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should return AuthenticatedUser if token is valid', async () => {
      mockSupabaseAuth.getUser.mockResolvedValueOnce({
        error: null,
        data: {
          user: {
            id: 'supa-123',
            email: 'test@example.com',
            user_metadata: { full_name: 'Test User' },
          },
        },
      });

      const user = await service.verifyToken('good-token');
      expect(user).toEqual({
        supabaseId: 'supa-123',
        email: 'test@example.com',
        displayName: 'Test User',
      });
    });
  });
});
