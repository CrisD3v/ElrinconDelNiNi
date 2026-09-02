import { notFound } from 'next/navigation';
import { getChapterPages, getSeriesChapters } from '@/lib/api/series';
import { ManhwaReader } from '@/components/reader/manhwa-reader';

interface ChapterReaderPageProps {
  params: Promise<{ id: string; chapterId: string; locale: string }>;
}

export default async function ChapterReaderPage({ params }: ChapterReaderPageProps) {
  const { id, chapterId, locale } = await params;

  try {
    const validLang: 'es' | 'en' = locale === 'en' ? 'en' : 'es';

    // Fetch chapter pages and chapter list concurrently
    const [pagesResult, chaptersResult] = await Promise.allSettled([
      getChapterPages(chapterId),
      getSeriesChapters(id, { lang: validLang, limit: 100 }),
    ]);

    if (pagesResult.status !== 'fulfilled' || !pagesResult.value?.pages?.length) {
      notFound();
    }

    const pages = pagesResult.value.pages;
    const chapters =
      chaptersResult.status === 'fulfilled'
        ? chaptersResult.value.chapters || []
        : [];

    // Find current chapter index and compute prev/next
    const currentIndex = chapters.findIndex((ch) => ch.id === chapterId);
    const currentChapter = currentIndex >= 0 ? chapters[currentIndex] : null;
    const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
    const nextChapter =
      currentIndex >= 0 && currentIndex < chapters.length - 1
        ? chapters[currentIndex + 1]
        : null;

    return (
      <ManhwaReader
        pages={pages}
        pagesDataSaver={pagesResult.value.pagesDataSaver}
        seriesId={id}
        chapterId={chapterId}
        prevChapterId={prevChapter?.id ?? null}
        nextChapterId={nextChapter?.id ?? null}
        currentChapterNumber={currentChapter?.chapter ?? null}
      />
    );
  } catch (error) {
    console.error('Failed to load chapter pages:', error);
    notFound();
  }
}
