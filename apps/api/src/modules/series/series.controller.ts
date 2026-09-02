import {
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SeriesService } from './series.service.js';
import { SeriesQueryDto } from './dto/series-query.dto.js';

@ApiTags('Series')
@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Get()
  @ApiOperation({ summary: 'Search for manga series' })
  @ApiResponse({ status: 200, description: 'List of matching series' })
  searchSeries(
    @Query(new ValidationPipe({ transform: true })) query: SeriesQueryDto,
  ) {
    return this.seriesService.searchSeries(query);
  }

  @Get('top')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600000) // Cache for 1 hour
  @ApiOperation({ summary: 'Get top rated series' })
  @ApiResponse({ status: 200, description: 'List of top series' })
  getTopSeries(
    @Query(new ValidationPipe({ transform: true })) query: SeriesQueryDto,
  ) {
    return this.seriesService.getTopSeries(query);
  }

  @Get('day')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(1800000) // Cache for 30 minutes
  @ApiOperation({ summary: 'Get series updated today' })
  @ApiResponse({ status: 200, description: 'List of daily updated series' })
  getDaySeries(
    @Query(new ValidationPipe({ transform: true })) query: SeriesQueryDto,
  ) {
    return this.seriesService.getDaySeries(query);
  }

  @Get('release')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300000) // Cache for 5 minutes
  @ApiOperation({ summary: 'Get recently released series' })
  @ApiResponse({ status: 200, description: 'List of recently released series' })
  getReleaseSeries(
    @Query(new ValidationPipe({ transform: true })) query: SeriesQueryDto,
  ) {
    return this.seriesService.getReleaseSeries(query);
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600000) // Cache for 1 hour
  @ApiOperation({ summary: 'Get detailed information about a specific series' })
  @ApiParam({ name: 'id', description: 'MangaDex Series ID' })
  @ApiResponse({ status: 200, description: 'Series details' })
  getSeriesDetail(@Param('id') id: string) {
    return this.seriesService.getSeriesDetail(id);
  }

  @Get(':id/chapters')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300000) // Cache for 5 minutes
  @ApiOperation({ summary: 'Get chapters for a specific series' })
  @ApiParam({ name: 'id', description: 'MangaDex Series ID' })
  @ApiResponse({ status: 200, description: 'List of chapters' })
  getSeriesChapters(
    @Param('id') id: string,
    @Query(new ValidationPipe({ transform: true })) query: SeriesQueryDto,
  ) {
    return this.seriesService.getSeriesChapters(id, query);
  }

  @Get('chapters/:chapterId/pages')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(900000) // Cache for 15 minutes (at-home URLs are temporary)
  @ApiOperation({ summary: 'Get page images for a specific chapter' })
  @ApiParam({ name: 'chapterId', description: 'MangaDex Chapter ID' })
  @ApiResponse({ status: 200, description: 'List of page image URLs' })
  getChapterPages(@Param('chapterId') chapterId: string) {
    return this.seriesService.getChapterPages(chapterId);
  }
}
