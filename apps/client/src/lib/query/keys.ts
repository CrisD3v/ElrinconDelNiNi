import type { SeriesCategory } from '../api/types';

/**
 * Query key factory for type-safe, consistent query keys.
 * Pattern: ['series', scope, ...params]
 */
export const seriesKeys = {
  all: ['series'] as const,
  
  lists: () => [...seriesKeys.all, 'list'] as const,

  /** Key for a category list: release, top, or day */
  category: (category: SeriesCategory, lang: string) =>
    [...seriesKeys.lists(), category, lang] as const,

  /** Key for search results */
  search: (lang: string, title?: string) =>
    [...seriesKeys.lists(), 'search', lang, title] as const,

  /** Key for paginated category list */
  categoryPaginated: (category: SeriesCategory, lang: string, offset: number) =>
    [...seriesKeys.category(category, lang), offset] as const,

  /** Key for a single series detail */
  detail: (id: string) => [...seriesKeys.all, 'detail', id] as const,
};
