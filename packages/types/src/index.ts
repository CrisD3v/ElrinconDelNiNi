export type Locale = 'es' | 'en';

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

// User & Profile
export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  locale: Locale;
  createdAt: string;
}

export interface UserMe {
  id: string;
  email: string;
  displayName: string;
  profileImage?: string | null;
  bannerImage?: string | null;
  description?: string | null;
  badges: string[];
  locale?: string;
  createdAt: string;
}

export interface UpdateProfileDto {
  displayName?: string;
  description?: string;
  avatar?: any;
}

// Series & Catalog
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

export interface SeriesList {
  series: SeriesDetail[];
  total: number;
  limit: number;
  offset: number;
}

export type SeriesCategory = 'release' | 'top' | 'day';

export interface SeriesQueryParams {
  lang: Locale;
  limit?: number;
  offset?: number;
  title?: string;
}

// Chapters
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

export interface ChapterList {
  chapters: Chapter[];
  total: number;
  limit: number;
  offset: number;
}

export interface ChapterPages {
  chapterId: string;
  pages: string[];
  pagesDataSaver: string[];
}