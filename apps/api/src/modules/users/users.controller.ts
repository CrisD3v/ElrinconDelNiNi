import * as path from 'path';
import {
  Controller,
  Get,
  UseGuards,
  Put,
  UseInterceptors,
  UploadedFiles,
  Body,
  BadRequestException,
  Param,
  Post,
  Delete,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { CurrentUser } from '#common/decorators/index.js';
import type { AuthenticatedUser } from '#common/types/index.js';
import { SupabaseAuthGuard } from '#modules/auth/index.js';
import { UsersService } from './users.service.js';
import { SupabaseStorageService } from '#common/services/index.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly storageService: SupabaseStorageService,
  ) {}

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'The user profile data' })
  async getMe(@CurrentUser() authUser: AuthenticatedUser) {
    const user = await this.usersService.findOrCreate(authUser);
    const createdAtStr =
      typeof (user.createdAt as any)?.toString === 'function'
        ? (user.createdAt as any).toString()
        : String(user.createdAt);

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      profileImage: user.profileImage,
      bannerImage: user.bannerImage,
      description: user.description,
      badges: user.badges,
      locale: user.locale,
      createdAt: createdAtStr,
    };
  }

  @Put('profile')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile and optionally upload images' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Image size exceeds limits' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profileImage', maxCount: 1 },
      { name: 'bannerImage', maxCount: 1 },
    ]),
  )
  async updateProfile(
    @CurrentUser() authUser: AuthenticatedUser,
    @Body() body: UpdateProfileDto,
    @UploadedFiles()
    files?: { profileImage?: any[]; bannerImage?: any[] },
  ): Promise<any> {
    const user = await this.usersService.findOrCreate(authUser);
    let profileImageUrl = user.profileImage;
    let bannerImageUrl = user.bannerImage;

    const MAX_PROFILE_SIZE =
      parseInt(process.env.MAX_PROFILE_IMAGE_SIZE_MB || '5') * 1024 * 1024;
    const MAX_BANNER_SIZE =
      parseInt(process.env.MAX_BANNER_IMAGE_SIZE_MB || '5') * 1024 * 1024;

    if (body.removeProfileImage === 'true' || body.removeProfileImage === true) {
      profileImageUrl = null;
    }

    if (body.removeBanner === 'true' || body.removeBanner === true) {
      bannerImageUrl = null;
    }

    if (files?.profileImage?.[0]) {
      const file = files.profileImage[0];
      if (file.size > MAX_PROFILE_SIZE)
        throw new BadRequestException(
          `Profile image exceeds size limit of ${process.env.MAX_PROFILE_IMAGE_SIZE_MB}MB`,
        );
      const ext = file.originalname ? path.extname(file.originalname) : '';
      profileImageUrl = await this.storageService.uploadFile(
        'ernn-users',
        `avatars/${user.id}-${Date.now()}${ext}`,
        file,
      );
    }

    if (files?.bannerImage?.[0]) {
      const file = files.bannerImage[0];
      if (file.size > MAX_BANNER_SIZE)
        throw new BadRequestException(
          `Banner image exceeds size limit of ${process.env.MAX_BANNER_IMAGE_SIZE_MB}MB`,
        );
      const ext = file.originalname ? path.extname(file.originalname) : '';
      bannerImageUrl = await this.storageService.uploadFile(
        'ernn-users',
        `banners/${user.id}-${Date.now()}${ext}`,
        file,
      );
    }

    const updatedUser = await this.usersService.updateProfile(user.id, {
      description: body.description,
      displayName: body.displayName,
      profileImage: profileImageUrl,
      bannerImage: bannerImageUrl,
    });

    const createdAtStr =
      typeof (updatedUser.createdAt as any)?.toString === 'function'
        ? (updatedUser.createdAt as any).toString()
        : String(updatedUser.createdAt);

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      displayName: updatedUser.displayName,
      profileImage: updatedUser.profileImage,
      bannerImage: updatedUser.bannerImage,
      description: updatedUser.description,
      badges: updatedUser.badges,
      locale: updatedUser.locale,
      createdAt: createdAtStr,
    };
  }

  @Post(':id/follow')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Follow a user' })
  @ApiResponse({ status: 201, description: 'Follow successful' })
  @ApiResponse({ status: 400, description: 'Cannot follow yourself' })
  @ApiResponse({ status: 404, description: 'Target user not found' })
  async followUser(
    @CurrentUser() authUser: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<any> {
    const user = await this.usersService.findOrCreate(authUser);
    return this.usersService.follow(user.id, id);
  }

  @Delete(':id/follow')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiResponse({ status: 200, description: 'Unfollow successful' })
  async unfollowUser(
    @CurrentUser() authUser: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    const user = await this.usersService.findOrCreate(authUser);
    return this.usersService.unfollow(user.id, id);
  }

  @Get(':id/followers')
  @ApiOperation({ summary: 'Get a list of followers for a given user' })
  @ApiResponse({ status: 200, description: 'List of followers' })
  async getFollowers(@Param('id') id: string) {
    return this.usersService.getFollowers(id);
  }

  @Get(':id/following')
  @ApiOperation({ summary: 'Get a list of users this user is following' })
  @ApiResponse({ status: 200, description: 'List of following users' })
  async getFollowing(@Param('id') id: string) {
    return this.usersService.getFollowing(id);
  }
}
