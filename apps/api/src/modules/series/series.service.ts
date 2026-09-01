import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { SeriesQueryDto } from './dto/series-query.dto.js';
import { ChapterDto, ChapterListDto, SeriesDetailDto, SeriesListDto } from './dto/series-response.dto.js';

@Injectable()
export class SeriesService {
  private readonly logger = new Logger(SeriesService.name);
  private readonly baseUrl = process.env.BASE_URL;
  private readonly uploadsUrl = process.env.UPLOADS_URL;

  constructor(private readonly httpService: HttpService) {}

  async searchSeries(query: SeriesQueryDto): Promise<SeriesListDto> {
    const params: Record<string, any> = {
      limit: query.limit || 20,
      offset: query.offset || 0,
      'availableTranslatedLanguage[]': query.lang,
      'includes[]': 'cover_art',
    };

    if (query.title) {
      params.title = query.title;
    }

    return this.fetchSeriesList(params);
  }

  async getTopSeries(query: SeriesQueryDto): Promise<SeriesListDto> {
    const params = {
      limit: query.limit || 20,
      offset: query.offset || 0,
      'availableTranslatedLanguage[]': query.lang,
      'includes[]': 'cover_art',
      'order[rating]': 'desc',
    };

    return this.fetchSeriesList(params);
  }

  async getDaySeries(query: SeriesQueryDto): Promise<SeriesListDto> {
    const params = {
      limit: query.limit || 20,
      offset: query.offset || 0,
      'availableTranslatedLanguage[]': query.lang,
      'includes[]': 'cover_art',
      'order[createdAt]': 'desc',
    };

    return this.fetchSeriesList(params);
  }

  async getReleaseSeries(query: SeriesQueryDto): Promise<SeriesListDto> {
    const params = {
      limit: query.limit || 20,
      offset: query.offset || 0,
      'availableTranslatedLanguage[]': query.lang,
      'includes[]': 'cover_art',
      'order[latestUploadedChapter]': 'desc',
    };

    return this.fetchSeriesList(params);
  }

  async getSeriesDetail(id: string): Promise<SeriesDetailDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/manga/${id}`, {
          params: { 'includes[]': 'cover_art' },
        }),
      );

      return this.mapMangaToDto(data.data);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getSeriesChapters(id: string, query: SeriesQueryDto): Promise<ChapterListDto> {
    const params = {
      limit: query.limit || 100,
      offset: query.offset || 0,
      'translatedLanguage[]': query.lang,
      'order[chapter]': 'asc',
    };

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/manga/${id}/feed`, { params }),
      );

      const chapters: ChapterDto[] = data.data.map((item: any) => ({
        id: item.id,
        title: item.attributes.title || null,
        chapter: item.attributes.chapter || null,
        volume: item.attributes.volume || null,
        pages: item.attributes.pages || 0,
        translatedLanguage: item.attributes.translatedLanguage,
        externalUrl: item.attributes.externalUrl || null,
        publishAt: item.attributes.publishAt,
      }));

      return {
        chapters,
        total: data.total,
        limit: data.limit,
        offset: data.offset,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private async fetchSeriesList(params: Record<string, any>): Promise<SeriesListDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/manga`, { params }),
      );

      const series = data.data.map((item: any) => this.mapMangaToDto(item));

      return {
        series,
        total: data.total,
        limit: data.limit,
        offset: data.offset,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private mapMangaToDto(manga: any): SeriesDetailDto {
    const attrs = manga.attributes;
    
    // Find cover art relationship
    const coverRel = manga.relationships?.find((r: any) => r.type === 'cover_art');
    let coverArtUrl: string | null = null;
    if (coverRel && coverRel.attributes?.fileName) {
      coverArtUrl = `${this.uploadsUrl}/covers/${manga.id}/${coverRel.attributes.fileName}`;
    }

    // Extract title (usually fallback to first available if en isn't there)
    const title = attrs.title.en || Object.values(attrs.title)[0] || 'Unknown';
    const description = attrs.description.en || Object.values(attrs.description || {})[0] || '';
    const tags = attrs.tags?.map((t: any) => t.attributes.name.en) || [];

    return {
      id: manga.id,
      title,
      description,
      status: attrs.status,
      year: attrs.year,
      contentRating: attrs.contentRating,
      tags,
      coverArtUrl,
      availableLanguages: attrs.availableTranslatedLanguages || [],
    };
  }

  private handleError(error: any): never {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new NotFoundException('Resource not found in MangaDex API');
      }
      this.logger.error(`MangaDex API Error: ${error.message}`, error.response?.data);
    } else {
      this.logger.error(`Unexpected Error: ${error.message}`, error.stack);
    }
    throw new InternalServerErrorException('Failed to communicate with MangaDex API');
  }
}
