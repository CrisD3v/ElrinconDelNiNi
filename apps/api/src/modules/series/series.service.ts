import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { SeriesQueryDto } from './dto/series-query.dto.js';
import {
  ChapterDto,
  ChapterListDto,
  ChapterPagesDto,
  SeriesDetailDto,
  SeriesListDto,
} from './dto/series-response.dto.js';

@Injectable()
export class SeriesService {
  private readonly logger = new Logger(SeriesService.name);
  private readonly baseUrl = process.env.BASE_URL;
  private readonly uploadsUrl = process.env.UPLOADS_URL;

  constructor(private readonly httpService: HttpService) {}

  async searchSeries(query: SeriesQueryDto): Promise<SeriesListDto> {
    const targetLangs =
      query.lang === 'es'
        ? ['es', 'es-la']
        : query.lang === 'en'
          ? ['en']
          : [query.lang || 'es'];

    const params: Record<string, any> = {
      limit: query.limit || 20,
      offset: query.offset || 0,
      'availableTranslatedLanguage[]': targetLangs,
      'includes[]': 'cover_art',
    };

    if (query.title) {
      params.title = query.title;
    }

    return this.fetchSeriesList(params, query.lang);
  }

  async getTopSeries(query: SeriesQueryDto): Promise<SeriesListDto> {
    const targetLangs =
      query.lang === 'es'
        ? ['es', 'es-la']
        : query.lang === 'en'
          ? ['en']
          : [query.lang || 'es'];

    const params = {
      limit: query.limit || 20,
      offset: query.offset || 0,
      'availableTranslatedLanguage[]': targetLangs,
      'includes[]': 'cover_art',
      'order[rating]': 'desc',
    };

    return this.fetchSeriesList(params, query.lang);
  }

  async getDaySeries(query: SeriesQueryDto): Promise<SeriesListDto> {
    const targetLangs =
      query.lang === 'es'
        ? ['es', 'es-la']
        : query.lang === 'en'
          ? ['en']
          : [query.lang || 'es'];

    const params = {
      limit: query.limit || 20,
      offset: query.offset || 0,
      'availableTranslatedLanguage[]': targetLangs,
      'includes[]': 'cover_art',
      'order[createdAt]': 'desc',
    };

    return this.fetchSeriesList(params, query.lang);
  }

  async getReleaseSeries(query: SeriesQueryDto): Promise<SeriesListDto> {
    const targetLangs =
      query.lang === 'es'
        ? ['es', 'es-la']
        : query.lang === 'en'
          ? ['en']
          : [query.lang || 'es'];

    const params = {
      limit: query.limit || 20,
      offset: query.offset || 0,
      'availableTranslatedLanguage[]': targetLangs,
      'includes[]': 'cover_art',
      'order[latestUploadedChapter]': 'desc',
    };

    return this.fetchSeriesList(params, query.lang);
  }

  async getSeriesDetail(id: string, lang?: string): Promise<SeriesDetailDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/manga/${id}`, {
          params: { 'includes[]': 'cover_art' },
        }),
      );

      if (!data?.data) {
        throw new NotFoundException('Series not found in MangaDex API');
      }

      if (lang) {
        const hasChapters = await this.hasChaptersInLanguage(id, lang);
        if (!hasChapters) {
          throw new NotFoundException(
            `Series has no readable chapters available in ${lang}`,
          );
        }
      }

      return await this.mapMangaToDto(data.data, lang);
    } catch (error) {
      this.handleError(error);
    }
  }

  async hasChaptersInLanguage(mangaId: string, lang: string): Promise<boolean> {
    try {
      const targetLangs =
        lang === 'es'
          ? ['es', 'es-la']
          : lang === 'en'
            ? ['en']
            : [lang || 'es'];

      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/manga/${mangaId}/aggregate`, {
          params: { 'translatedLanguage[]': targetLangs },
        }),
      );

      const volumes = data?.volumes || {};
      return Object.keys(volumes).length > 0;
    } catch {
      return false;
    }
  }

  async getSeriesChapters(
    id: string,
    query: SeriesQueryDto,
  ): Promise<ChapterListDto> {
    const targetLangs =
      query.lang === 'es'
        ? ['es', 'es-la']
        : query.lang === 'en'
          ? ['en']
          : [query.lang || 'es'];

    const params: Record<string, any> = {
      limit: query.limit || 100,
      offset: query.offset || 0,
      'translatedLanguage[]': targetLangs,
      'order[chapter]': 'asc',
      includeExternalUrl: 0,
    };

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/manga/${id}/feed`, { params }),
      );

      // Strong filtering: only include chapters matching target language with pages > 0 and no external URLs
      const filteredItems = (data.data || []).filter((item: any) => {
        const lang = item.attributes?.translatedLanguage;
        const pages = item.attributes?.pages ?? 0;
        const externalUrl = item.attributes?.externalUrl;
        return targetLangs.includes(lang) && pages > 0 && !externalUrl;
      });

      const chapters: ChapterDto[] = filteredItems.map((item: any) => ({
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
        total: chapters.length,
        limit: query.limit || 100,
        offset: query.offset || 0,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async getChapter(chapterId: string): Promise<ChapterDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/chapter/${chapterId}`),
      );

      const item = data.data;
      return {
        id: item.id,
        title: item.attributes.title || null,
        chapter: item.attributes.chapter || null,
        volume: item.attributes.volume || null,
        pages: item.attributes.pages || 0,
        translatedLanguage: item.attributes.translatedLanguage,
        externalUrl: item.attributes.externalUrl || null,
        publishAt: item.attributes.publishAt,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async getChapterPages(chapterId: string): Promise<ChapterPagesDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/at-home/server/${chapterId}`, {
          params: { forcePort443: true },
        }),
      );

      const baseUrl = data.baseUrl;
      const hash = data.chapter.hash;
      const dataFiles: string[] = data.chapter.data || [];
      const dataSaverFiles: string[] = data.chapter.dataSaver || [];

      const pages = dataFiles.map(
        (filename: string) => `${baseUrl}/data/${hash}/${filename}`,
      );
      const pagesDataSaver = dataSaverFiles.map(
        (filename: string) => `${baseUrl}/data-saver/${hash}/${filename}`,
      );

      return { chapterId, pages, pagesDataSaver };
    } catch (error) {
      this.handleError(error);
    }
  }

  private async fetchSeriesList(
    params: Record<string, any>,
    lang?: string,
  ): Promise<SeriesListDto> {
    try {
      const requestedLimit = params.limit || 20;
      // Request extra candidates to account for titles lacking readable chapters
      const fetchParams = {
        ...params,
        limit: Math.min(100, requestedLimit * 2),
      };

      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/manga`, { params: fetchParams }),
      );

      const targetLangs =
        lang === 'es'
          ? ['es', 'es-la']
          : lang === 'en'
            ? ['en']
            : [lang || 'es'];

      // Quick candidate filter: check availableTranslatedLanguages array
      const candidateItems = (data.data || []).filter((item: any) => {
        const available: string[] =
          item.attributes?.availableTranslatedLanguages || [];
        return available.some((l: string) => targetLangs.includes(l));
      });

      // Strict chapter verification in parallel (discards stale MangaDex records like Noragami in ES)
      const checks = await Promise.allSettled(
        candidateItems.map((item: any) =>
          this.hasChaptersInLanguage(item.id, lang || 'es'),
        ),
      );

      const validItems = candidateItems
        .filter((_, idx) => {
          const res = checks[idx];
          return res.status === 'fulfilled' && res.value === true;
        })
        .slice(0, requestedLimit);

      const series = await Promise.all(
        validItems.map((item: any) => this.mapMangaToDto(item, lang)),
      );

      return {
        series,
        total: data.total || validItems.length,
        limit: requestedLimit,
        offset: params.offset || 0,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private readonly translationCache = new Map<string, string>();

  private async translateTextToSpanish(
    mangaId: string,
    text: string,
  ): Promise<string> {
    if (!text) return '';
    if (this.translationCache.has(mangaId)) {
      return this.translationCache.get(mangaId)!;
    }

    try {
      const paragraphs = text.split('\n\n').filter(Boolean);
      const translatedParagraphs: string[] = [];

      for (const para of paragraphs) {
        if (
          para.startsWith('---') ||
          para.startsWith('___') ||
          para.startsWith('*Source:') ||
          para.startsWith('**Note:')
        ) {
          translatedParagraphs.push(para);
          continue;
        }

        const cleanPara = para.trim().replace(/\n/g, ' ');
        if (!cleanPara) continue;

        try {
          const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
            cleanPara.substring(0, 450),
          )}&langpair=en|es`;
          const { data } = await firstValueFrom(
            this.httpService.get(url, { timeout: 3000 }),
          );

          if (data?.responseData?.translatedText) {
            translatedParagraphs.push(data.responseData.translatedText);
          } else {
            translatedParagraphs.push(para);
          }
        } catch {
          translatedParagraphs.push(para);
        }
      }

      const result = translatedParagraphs.join('\n\n') || text;
      this.translationCache.set(mangaId, result);
      return result;
    } catch {
      return text;
    }
  }

  private async mapMangaToDto(
    manga: any,
    lang?: string,
  ): Promise<SeriesDetailDto> {
    const attrs = manga.attributes;

    // Find cover art relationship
    const coverRel = manga.relationships?.find(
      (r: any) => r.type === 'cover_art',
    );
    let coverArtUrl: string | null = null;
    if (coverRel && coverRel.attributes?.fileName) {
      coverArtUrl = `${this.uploadsUrl}/covers/${manga.id}/${coverRel.attributes.fileName}`;
    }

    // Extract title: Keep canonical / original title (English/Romaji) without translating to local variants (e.g. "Dragon Ball", NOT "Bola de Dragón")
    const title =
      attrs.title?.en ||
      attrs.title?.['ja-ro'] ||
      attrs.title?.['ko-ro'] ||
      Object.values(attrs.title || {})[0] ||
      'Unknown';

    // Extract description matching requested language
    let description = '';
    if (attrs.description) {
      if (lang === 'es') {
        const nativeEs = attrs.description.es || attrs.description['es-la'];
        if (nativeEs) {
          description = nativeEs;
        } else if (attrs.description.en) {
          // Auto-translate English description to Spanish when MangaDex has no Spanish synopsis
          description = await this.translateTextToSpanish(
            manga.id,
            attrs.description.en,
          );
        } else {
          description = (Object.values(attrs.description)[0] as string) || '';
        }
      } else if (lang) {
        description =
          attrs.description[lang] ||
          attrs.description.en ||
          (Object.values(attrs.description)[0] as string) ||
          '';
      } else {
        description =
          attrs.description.en ||
          (Object.values(attrs.description)[0] as string) ||
          '';
      }
    }

    const tags =
      attrs.tags
        ?.map((t: any) => {
          const nameObj = t.attributes?.name || {};
          return (
            (lang ? nameObj[lang] : null) ||
            nameObj.en ||
            Object.values(nameObj)[0] ||
            ''
          );
        })
        .filter(Boolean) || [];

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
    if (error instanceof HttpException) {
      throw error;
    }
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new NotFoundException('Resource not found in MangaDex API');
      }
      this.logger.error(
        `MangaDex API Error: ${error.message}`,
        error.response?.data,
      );
    } else {
      this.logger.error(`Unexpected Error: ${error.message}`, error.stack);
    }
    throw new InternalServerErrorException(
      'Failed to communicate with MangaDex API',
    );
  }
}
