import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth.module.js';
import { AuthService } from '../auth.service.js';
import { describe, it, expect } from '@jest/globals';

describe('Auth Integration', () => {
  it('should compile the module and resolve the service', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [() => ({ SUPABASE_URL: 'http://mock-url', SUPABASE_SERVICE_ROLE_KEY: 'mock-key' })],
        }),
        AuthModule,
      ],
    }).compile();

    const service = module.get<AuthService>(AuthService);
    expect(service).toBeDefined();
  });
});
