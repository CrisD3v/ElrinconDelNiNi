import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { SeriesController } from '../series.controller.js';
import { SeriesService } from '../series.service.js';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { of } from 'rxjs';

describe('Series Integration', () => {
  let controller: SeriesController;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [SeriesController],
      providers: [
        SeriesService,
        {
          provide: CACHE_MANAGER,
          useValue: { get: jest.fn(), set: jest.fn(), del: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<SeriesController>(SeriesController);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should flow from controller through service to HttpService', async () => {
    jest.spyOn(httpService, 'get').mockImplementation(() => of({
      data: { data: [{
        id: '1',
        attributes: { title: { en: 'Test Manga' }, status: 'completed' },
        relationships: []
      }], total: 1, limit: 10, offset: 0 },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} as any },
    } as any));

    jest.spyOn(httpService, 'get').mockImplementationOnce(() => of({
      data: { data: [{
        id: '1',
        attributes: { title: { en: 'Test Manga' }, status: 'completed', availableTranslatedLanguages: ['en'] },
        relationships: []
      }], total: 1, limit: 10, offset: 0 },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} as any },
    } as any));

    jest.spyOn(httpService, 'get').mockImplementationOnce(() => of({
      data: { volumes: { "1": {} } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} as any },
    } as any));

    const result = await controller.searchSeries({ lang: 'en', limit: 10 });
    expect(result.series).toBeDefined();
    expect(result.series.length).toBe(1);
    expect(result.series[0].title).toBe('Test Manga');
  });
});
