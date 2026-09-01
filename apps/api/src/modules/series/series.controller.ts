import { Controller, Get, Param, Query, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { SeriesService } from './series.service.js';
import { SeriesQueryDto } from './dto/series-query.dto.js';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Get()
  searchSeries(@Query(new ValidationPipe({ transform: true })) query: SeriesQueryDto) {
    return this.seriesService.searchSeries(query);
  }

  @Get('top')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600000) // Cache for 1 hour
  getTopSeries(@Query(new ValidationPipe({ transform: true })) query: SeriesQueryDto) {
    return this.seriesService.getTopSeries(query);
  }

  @Get('day')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(1800000) // Cache for 30 minutes
  getDaySeries(@Query(new ValidationPipe({ transform: true })) query: SeriesQueryDto) {
    return this.seriesService.getDaySeries(query);
  }

  @Get('release')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300000) // Cache for 5 minutes
  getReleaseSeries(@Query(new ValidationPipe({ transform: true })) query: SeriesQueryDto) {
    return this.seriesService.getReleaseSeries(query);
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600000) // Cache for 1 hour
  getSeriesDetail(@Param('id') id: string) {
    return this.seriesService.getSeriesDetail(id);
  }

  @Get(':id/chapters')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300000) // Cache for 5 minutes
  getSeriesChapters(
    @Param('id') id: string,
    @Query(new ValidationPipe({ transform: true })) query: SeriesQueryDto,
  ) {
    return this.seriesService.getSeriesChapters(id, query);
  }
}
