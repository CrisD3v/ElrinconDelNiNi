import * as path from 'path';
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import { CurrentUser } from '#common/decorators/index.js';
import type { AuthenticatedUser } from '#common/types/index.js';
import { SupabaseAuthGuard } from '#modules/auth/index.js';
import { CommentsService } from './comments.service.js';
import { SupabaseStorageService } from '#common/services/index.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import { LikeCommentDto } from './dto/like-comment.dto.js';
import { ReactCommentDto } from './dto/react-comment.dto.js';
import { ReportCommentDto } from './dto/report-comment.dto.js';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly storageService: SupabaseStorageService,
  ) {}

  // ─── Create ──────────────────────────────────────────────────────────────────

  @Post()
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new comment or reply' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
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
      const ext = file.originalname ? path.extname(file.originalname) : '';
      imageUrl = await this.storageService.uploadFile(
        'ernn-users',
        `comments/${authUser.supabaseId}-${Date.now()}${ext}`,
        file,
      );
    }

    return this.commentsService.createComment(authUser, { ...body, imageUrl });
  }

  // ─── List ────────────────────────────────────────────────────────────────────

  @Get('series/:mangaId')
  @ApiOperation({
    summary: 'Get comments for a manga series (cursor paginated)',
  })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiResponse({ status: 200, description: 'Paginated comments with replies' })
  async getCommentsByManga(
    @Param('mangaId') mangaId: string,
    @Query('cursor') cursor?: string,
    @Request() req?: any,
  ) {
    const userId = req?.user?.id ?? undefined;
    return this.commentsService.getCommentsByManga(mangaId, cursor, userId);
  }

  @Get('chapters/:chapterId')
  @ApiOperation({ summary: 'Get comments for a chapter (cursor paginated)' })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiResponse({ status: 200, description: 'Paginated comments with replies' })
  async getCommentsByChapter(
    @Param('chapterId') chapterId: string,
    @Query('cursor') cursor?: string,
    @Request() req?: any,
  ) {
    const userId = req?.user?.id ?? undefined;
    return this.commentsService.getCommentsByChapter(chapterId, cursor, userId);
  }

  // ─── Update ──────────────────────────────────────────────────────────────────

  @Patch(':id')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Edit own comment' })
  @ApiResponse({ status: 200, description: 'Comment updated' })
  async updateComment(
    @CurrentUser() authUser: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(authUser, id, body);
  }

  // ─── Delete ──────────────────────────────────────────────────────────────────

  @Delete(':id')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete own comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted' })
  async deleteComment(
    @CurrentUser() authUser: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.commentsService.deleteComment(authUser, id);
  }

  // ─── Like / Dislike ──────────────────────────────────────────────────────────

  @Post(':id/like')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Like (+1) or dislike (-1) a comment. Toggling removes the vote.',
  })
  @ApiResponse({ status: 201, description: 'Vote registered' })
  async likeComment(
    @CurrentUser() authUser: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: LikeCommentDto,
  ) {
    return this.commentsService.likeComment(authUser, id, body.value);
  }

  // ─── React ───────────────────────────────────────────────────────────────────

  @Post(':id/react')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle an emoji reaction on a comment' })
  @ApiResponse({ status: 201, description: 'Reaction toggled' })
  async reactComment(
    @CurrentUser() authUser: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: ReactCommentDto,
  ) {
    return this.commentsService.reactComment(authUser, id, body.emoji);
  }

  // ─── Report ──────────────────────────────────────────────────────────────────

  @Post(':id/report')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Report a comment. Auto-hides after 5 reports.' })
  @ApiResponse({ status: 201, description: 'Report registered' })
  async reportComment(
    @CurrentUser() authUser: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: ReportCommentDto,
  ) {
    return this.commentsService.reportComment(authUser, id, body.reason);
  }

  // ─── Pin ─────────────────────────────────────────────────────────────────────

  @Post(':id/pin')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pin or unpin a comment (admin only)' })
  @ApiQuery({ name: 'pinned', required: false })
  @ApiResponse({ status: 201, description: 'Pin status updated' })
  async pinComment(
    @Param('id') id: string,
    @Query('pinned') pinned: string = 'true',
  ) {
    return this.commentsService.pinComment(id, pinned !== 'false');
  }

  // ─── User search (@mentions) ─────────────────────────────────────────────────

  @Get('users/search')
  @ApiOperation({ summary: 'Search users by displayName for @mentions' })
  @ApiQuery({ name: 'q', required: true })
  @ApiResponse({ status: 200, description: 'Matching users' })
  async searchUsers(@Query('q') q: string) {
    return this.commentsService.searchUsers(q);
  }

  // ─── Get ─────────────────────────────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({ summary: 'Get a single comment by ID' })
  @ApiResponse({ status: 200, description: 'The comment' })
  async getComment(@Param('id') id: string, @Request() req?: any) {
    const userId = req?.user?.id ?? undefined;
    return this.commentsService.getComment(id, userId);
  }
}
