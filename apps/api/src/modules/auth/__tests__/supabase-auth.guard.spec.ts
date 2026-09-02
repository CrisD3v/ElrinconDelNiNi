import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces';
import { AuthService } from '../auth.service.js';
import { SupabaseAuthGuard } from '../supabase-auth.guard.js';

describe('SupabaseAuthGuard', () => {
  let guard: SupabaseAuthGuard;
  let authService: { verifyToken: jest.Mock };

  beforeEach(async () => {
    authService = { verifyToken: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupabaseAuthGuard,
        { provide: AuthService, useValue: authService },
      ],
    }).compile();

    guard = module.get(SupabaseAuthGuard);
  });

  function createContext(authHeader?: string): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: authHeader },
        }),
      }),
    } as ExecutionContext;
  }

  it('rejects requests without token', async () => {
    await expect(guard.canActivate(createContext())).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('attaches user to request with valid token', async () => {
    const user = { supabaseId: 'uuid-1', email: 'test@example.com' };
    authService.verifyToken.mockResolvedValue(user);

    const request = { headers: { authorization: 'Bearer valid-token' } };
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request).toHaveProperty('user', user);
  });
});
