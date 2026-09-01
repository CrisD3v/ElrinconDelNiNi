import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '#common/decorators/index.js';
import type { AuthenticatedUser } from '#common/types/index.js';
import { SupabaseAuthGuard } from '#modules/auth/index.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  async getMe(@CurrentUser() authUser: AuthenticatedUser) {
    const user = await this.usersService.findOrCreate(authUser);
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      locale: user.locale,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
