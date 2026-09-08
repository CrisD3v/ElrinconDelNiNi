import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { AxiosResponse, AxiosError, AxiosHeaders } from 'axios';
import {
  jest,
  expect,
  describe,
  it,
  beforeEach,
  afterEach,
} from '@jest/globals';
import { SeriesService } from '../series.service.js';
import { SeriesLanguage } from '../dto/series-query.dto.js';

describe('SeriesService', () => {
  let service: SeriesService;
  let httpService: HttpService;

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeriesService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<SeriesService>(SeriesService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchSeries', () => {
    it('should map lang query parameter to availableTranslatedLanguage[]', async () => {
      const mockResponse: AxiosResponse = {
        data: { data: [], total: 0, limit: 20, offset: 0 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders() },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      await service.searchSeries({ lang: SeriesLanguage.ES, limit: 10 });

      expect(httpService.get).toHaveBeenCalledWith(
        `${process.env.BASE_URL}/manga`,
        expect.objectContaining({
          params: {
            limit: 20,
            offset: 0,
            'availableTranslatedLanguage[]': ['es', 'es-la'],
            'includes[]': 'cover_art',
          },
        }),
      );
    });
  });

  describe('getSeriesChapters', () => {
    it('should map lang query parameter to translatedLanguage[] for chapters feed', async () => {
      const mockResponse: AxiosResponse = {
        data: { data: [], total: 0, limit: 100, offset: 0 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders() },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      await service.getSeriesChapters('manga-id', { lang: SeriesLanguage.EN });

      expect(httpService.get).toHaveBeenCalledWith(
        `${process.env.BASE_URL}/manga/manga-id/feed`,
        expect.objectContaining({
          params: {
            limit: 100,
            offset: 0,
            'translatedLanguage[]': ['en'],
            'order[chapter]': 'asc',
            includeExternalUrl: 0,
          },
        }),
      );
    });
  });

  describe('Data Transformation (mapMangaToDto)', () => {
    it('should extract title, tags, and cover URL correctly', async () => {
      const mockMangaResponse = {
        id: '12345',
        attributes: {
          title: { 'ja-ro': 'Naruto', en: 'Naruto English' },
          description: { en: 'Ninja story' },
          status: 'completed',
          year: 1999,
          contentRating: 'safe',
          tags: [{ attributes: { name: { en: 'Action' } } }],
          availableTranslatedLanguages: ['en', 'es'],
        },
        relationships: [
          { type: 'author', id: 'auth-id' },
          { type: 'cover_art', attributes: { fileName: 'cover.jpg' } },
        ],
      };

      const mockResponse: AxiosResponse = {
        data: { data: [mockMangaResponse], total: 1, limit: 20, offset: 0 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders() },
      };

      mockHttpService.get.mockImplementation((url) => {
        if (url.includes('aggregate')) {
          return of({ data: { volumes: { "1": {} } } });
        }
        return of(mockResponse);
      });

      const result = await service.getTopSeries({ lang: SeriesLanguage.EN });

      expect(result.series[0]).toEqual({
        id: '12345',
        title: 'Naruto English',
        description: 'Ninja story',
        status: 'completed',
        year: 1999,
        contentRating: 'safe',
        tags: ['Action'],
        coverArtUrl: `${process.env.UPLOADS_URL}/covers/12345/cover.jpg`,
        availableLanguages: ['en', 'es'],
      });
    });

    it('should fallback to first title if requested language title is missing', async () => {
      const mockMangaResponse = {
        id: '12345',
        attributes: {
          title: { ja: 'Original Title' },
          description: {},
          tags: [],
          availableTranslatedLanguages: [],
        },
        relationships: [],
      };

      const mockResponse: AxiosResponse = {
        data: { data: mockMangaResponse },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders() },
      };

      mockHttpService.get.mockImplementation((url) => {
        if (url.includes('aggregate')) {
          return of({ data: { volumes: { "1": {} } } });
        }
        return of(mockResponse);
      });

      const result = await service.getSeriesDetail('12345');

      expect(result.title).toBe('Original Title');
      expect(result.coverArtUrl).toBeNull(); // No cover relationship
    });
  });

  describe('Error Handling', () => {
    it('should throw NotFoundException on 404 from MangaDex', async () => {
      const error = new AxiosError('Not Found', '404', undefined, undefined, {
        status: 404,
        statusText: 'Not Found',
        data: {},
        headers: {},
        config: { headers: new AxiosHeaders() },
      } as any);

      mockHttpService.get.mockReturnValue(throwError(() => error));

      await expect(service.getSeriesDetail('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      const error = new AxiosError(
        'Network Error',
        '500',
        undefined,
        undefined,
        {
          status: 500,
          statusText: 'Internal Server Error',
          data: {},
          headers: {},
          config: { headers: new AxiosHeaders() },
        } as any,
      );

      mockHttpService.get.mockReturnValue(throwError(() => error));

      await expect(service.getSeriesDetail('id')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
