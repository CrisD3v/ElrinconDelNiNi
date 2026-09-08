import { Test, TestingModule } from '@nestjs/testing';
import { SeriesController } from '../series.controller.js';
import { SeriesService } from '../series.service.js';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

describe('SeriesController', () => {
  let controller: SeriesController;

  const mockSeriesService = {
    searchSeries: jest.fn(),
    getTopSeries: jest.fn(),
    getDaySeries: jest.fn(),
    getReleaseSeries: jest.fn(),
    getSeriesDetail: jest.fn(),
    getSeriesChapters: jest.fn(),
    getChapter: jest.fn(),
    getChapterPages: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeriesController],
      providers: [
        {
          provide: SeriesService,
          useValue: mockSeriesService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: { get: jest.fn(), set: jest.fn(), del: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<SeriesController>(SeriesController);
  });

  it('should call searchSeries on the service', async () => {
    mockSeriesService.searchSeries.mockResolvedValueOnce({ series: [] });
    const result = await controller.searchSeries({ limit: 10 });
    expect(mockSeriesService.searchSeries).toHaveBeenCalledWith({ limit: 10 });
    expect(result).toEqual({ series: [] });
  });

  it('should call getSeriesDetail on the service', async () => {
    mockSeriesService.getSeriesDetail.mockResolvedValueOnce({ id: '1' });
    const result = await controller.getSeriesDetail('1', 'es');
    expect(mockSeriesService.getSeriesDetail).toHaveBeenCalledWith('1', 'es');
    expect(result).toEqual({ id: '1' });
  });

  it('should call getSeriesChapters on the service', async () => {
    mockSeriesService.getSeriesChapters.mockResolvedValueOnce({ chapters: [] });
    const result = await controller.getSeriesChapters('1', { limit: 10 });
    expect(mockSeriesService.getSeriesChapters).toHaveBeenCalledWith('1', { limit: 10 });
    expect(result).toEqual({ chapters: [] });
  });

  it('should call getChapterPages on the service', async () => {
    mockSeriesService.getChapterPages.mockResolvedValueOnce({ pages: [] });
    const result = await controller.getChapterPages('c-1');
    expect(mockSeriesService.getChapterPages).toHaveBeenCalledWith('c-1');
    expect(result).toEqual({ pages: [] });
  });
});
