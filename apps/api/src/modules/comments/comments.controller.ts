import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
import { CommentsService } from './comments.service.js';
import { SupabaseStorageService } from '#common/services/index.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly storageService: SupabaseStorageService,
  ) {}

  @Post()
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 400, description: 'Validation or file size error' })
  @UseInterceptors(FileInterceptor('image'))
  async createComment(
    @CurrentUser() authUser: AuthenticatedUser,
    @Body() body: CreateCommentDto,
    @UploadedFile() file?: any,
  ): Promise<any> {
    let imageUrl: string | null = null;
    const MAX_SIZE =
      parseInt(process.env.MAX_COMMENTS_IMAGES_SIZE_MB || '5') * 1024 * 1024;

    if (file) {
      if (file.size > MAX_SIZE)
        throw new BadRequestException(
          `Image exceeds size limit of ${process.env.MAX_COMMENTS_IMAGES_SIZE_MB}MB`,
        );
      imageUrl = await this.storageService.uploadFile(
        'ernn-users',
        `comments/${authUser.supabaseId}-${Date.now()}`,
        file,
      );
    }

    return this.commentsService.createComment(authUser, {
      ...body,
      imageUrl,
    });
  }

  @Get('series/:mangaId')
  @ApiOperation({ summary: 'Get comments for a specific manga series' })
  @ApiResponse({ status: 200, description: 'List of comments' })
  async getCommentsByManga(@Param('mangaId') mangaId: string) {
    return this.commentsService.getCommentsByManga(mangaId);
  }

  @Get('chapters/:chapterId')
  @ApiOperation({ summary: 'Get comments for a specific chapter' })
  @ApiResponse({ status: 200, description: 'List of comments' })
  async getCommentsByChapter(@Param('chapterId') chapterId: string) {
    return this.commentsService.getCommentsByChapter(chapterId);
  }
}
