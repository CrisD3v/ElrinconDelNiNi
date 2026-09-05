import { apiGet } from './client';
import type { SeriesList, SeriesDetail, SeriesQueryParams, Chapter, ChapterList, ChapterPages } from './types';

/** Convert query params to a plain record for apiGet */
function toParams(params?: object): Record<string, string | number | boolean | undefined> | undefined {
  if (!params) return undefined;
  return params as Record<string, string | number | boolean | undefined>;
}

/**
 * Fetch recently released series.
 */
export function getReleaseSeries(params: SeriesQueryParams): Promise<SeriesList> {
  return apiGet<SeriesList>('/series/release', toParams(params));
}

/**
 * Fetch top rated series.
 */
export function getTopSeries(params: SeriesQueryParams): Promise<SeriesList> {
  return apiGet<SeriesList>('/series/top', toParams(params));
}

/**
 * Fetch daily updated series.
 */
export function getDaySeries(params: SeriesQueryParams): Promise<SeriesList> {
  return apiGet<SeriesList>('/series/day', toParams(params));
}

/**
 * Search series by title.
 */
export function searchSeries(params: SeriesQueryParams): Promise<SeriesList> {
  return apiGet<SeriesList>('/series', toParams(params));
}

/**
 * Fetch detailed info for a single series.
 */
export function getSeriesDetail(id: string, lang?: string): Promise<SeriesDetail> {
  const queryParams = lang ? { lang } : undefined;
  return apiGet<SeriesDetail>(`/series/${id}`, queryParams);
}

/**
 * Fetch chapters for a specific series.
 */
export function getSeriesChapters(
  id: string,
  params?: { lang?: string; limit?: number; offset?: number }
): Promise<ChapterList> {
  const queryParams = params ? toParams(params) : undefined;
  return apiGet<ChapterList>(`/series/${id}/chapters`, queryParams);
}

/**
 * Fetch metadata for a specific chapter.
 */
export function getChapter(chapterId: string): Promise<Chapter> {
  return apiGet<Chapter>(`/series/chapters/${chapterId}`);
}

/**
 * Fetch page images for a specific chapter.
 */
export function getChapterPages(chapterId: string): Promise<ChapterPages> {
  return apiGet<ChapterPages>(`/series/chapters/${chapterId}/pages`);
}

/** Map category slug to its fetcher function */
const categoryFetchers = {
  release: getReleaseSeries,
  top: getTopSeries,
  day: getDaySeries,
  all: searchSeries,
} as const;

/**
 * Fetch series by category name (release | top | day).
 */
export function getSeriesByCategory(
  category: keyof typeof categoryFetchers,
  params: SeriesQueryParams,
): Promise<SeriesList> {
  const fetcher = categoryFetchers[category];
  if (!fetcher) {
    throw new Error(`Unknown series category: ${category}`);
  }
  return fetcher(params);
}
