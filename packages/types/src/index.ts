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

export type SeriesCategory = 'release' | 'top' | 'day' | 'all';

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

// Comments
export interface CommentUser {
  id: string;
  displayName: string;
  profileImage?: string | null;
  bannerImage?: string | null;
  description?: string | null;
  badges: string[];
}

export interface CommentReactionGroup {
  emoji: string;
  count: number;
  reactedByMe: boolean;
}

export interface Comment {
  id: string;
  content: string;
  imageUrl?: string | null;
  isSpoiler: boolean;
  isHidden: boolean;
  isPinned: boolean;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
  user: CommentUser;
  likesCount: number;
  dislikesCount: number;
  myVote: 1 | -1 | 0;
  reactions: CommentReactionGroup[];
  reportsCount: number;
  replies: Comment[];
}

export interface CommentsPage {
  comments: Comment[];
  nextCursor: string | null;
  total: number;
}

export interface CreateCommentPayload {
  content: string;
  mangaId?: string;
  chapterId?: string;
  parentId?: string;
  isSpoiler?: boolean;
  image?: File | null;
}

export interface UpdateCommentPayload {
  content?: string;
  isSpoiler?: boolean;
}