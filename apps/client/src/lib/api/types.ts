/** Mirrors the API's SeriesDetailDto */
export interface SeriesDetail {
  id: string;
  title: string;
  description: string;
  status: string;
  year: number | null;
  contentRating: string;
  tags: string[];
  coverArtUrl: string | null;
  availableLanguages: string[];
}

/** Mirrors the API's SeriesListDto */
export interface SeriesList {
  series: SeriesDetail[];
  total: number;
  limit: number;
  offset: number;
}

/** Mirrors the API's ChapterDto */
export interface Chapter {
  id: string;
  title: string | null;
  chapter: string | null;
  volume: string | null;
  pages: number;
  translatedLanguage: string;
  externalUrl: string | null;
  publishAt: string;
}

/** Mirrors the API's ChapterListDto */
export interface ChapterList {
  chapters: Chapter[];
  total: number;
  limit: number;
  offset: number;
}

/** Mirrors the API's ChapterPagesDto */
export interface ChapterPages {
  chapterId: string;
  pages: string[];
  pagesDataSaver: string[];
}

/** Query parameters for series endpoints */
export interface SeriesQueryParams {
  lang: 'es' | 'en';
  limit?: number;
  offset?: number;
  title?: string;
}

/** Valid series categories for the home sections */
export type SeriesCategory = 'release' | 'top' | 'day';
