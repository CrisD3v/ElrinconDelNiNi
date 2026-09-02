export interface ChapterDto {
  id: string;
  title: string | null;
  chapter: string | null;
  volume: string | null;
  pages: number;
  translatedLanguage: string;
  externalUrl: string | null;
  publishAt: string;
}

export interface SeriesDetailDto {
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

export interface SeriesListDto {
  series: SeriesDetailDto[];
  total: number;
  limit: number;
  offset: number;
}

export interface ChapterListDto {
  chapters: ChapterDto[];
  total: number;
  limit: number;
  offset: number;
}

export interface ChapterPagesDto {
  chapterId: string;
  pages: string[];
  pagesDataSaver: string[];
}
