import { notFound, redirect } from 'next/navigation';
import { getChapter, getChapterPages, getSeriesChapters } from '@/lib/api/series';
import { ManhwaReader } from '@/components/reader/manhwa-reader';
import { Chapter, ChapterPages } from '@/lib/api/types';

interface ChapterReaderPageProps {
  params: Promise<{ id: string; chapterId: string; locale: string }>;
}

export default async function ChapterReaderPage({ params }: ChapterReaderPageProps) {
  const { id, chapterId, locale } = await params;
  const validLang: 'es' | 'en' = locale === 'en' ? 'en' : 'es';

  let chapterInfo: Chapter | undefined;
  let chapters: Chapter[] = [];
  let pagesResult: ChapterPages | undefined;

  try {
    // 1. Fetch current chapter info and chapters for this series in target language concurrently
    const [chapterInfoResult, chaptersResult] = await Promise.allSettled([
      getChapter(chapterId),
      getSeriesChapters(id, { lang: validLang, limit: 100 }),
    ]);

    if (chapterInfoResult.status === 'fulfilled' && chapterInfoResult.value) {
      chapterInfo = chapterInfoResult.value;
    }
    if (chaptersResult.status === 'fulfilled' && chaptersResult.value) {
      chapters = chaptersResult.value.chapters || [];
    }
  } catch (error) {
    console.error('Failed to load chapter info:', error);
  }

  if (!chapterInfo) {
    notFound();
  }

  // 2. Language check: If the chapter language differs from route locale (e.g. user switched ES <-> EN)
  const isSpanish =
    validLang === 'es' &&
    (chapterInfo.translatedLanguage === 'es' ||
      chapterInfo.translatedLanguage === 'es-la');
  const isEnglish =
    validLang === 'en' && chapterInfo.translatedLanguage === 'en';
  const isLanguageMatch = isSpanish || isEnglish;

  if (!isLanguageMatch) {
    // Find matching chapter with the same chapter number in the target language
    const matchingChapter = chapters.find(
      (ch) => ch.chapter === chapterInfo.chapter,
    );

    if (matchingChapter && matchingChapter.id !== chapterId) {
      // Redirect to equivalent episode in the target language
      redirect(`/${locale}/series/detail/${id}/chapter/${matchingChapter.id}`);
    } else {
      // Episode does not exist in target language: redirect to series episode list
      redirect(`/${locale}/series/detail/${id}`);
    }
  }

  // 3. Current chapter language matches route locale: fetch pages
  try {
    pagesResult = await getChapterPages(chapterId);
  } catch (error) {
    console.error('Failed to load chapter pages:', error);
  }

  if (!pagesResult?.pages?.length) {
    notFound();
  }

  const pages = pagesResult.pages;

  // Find current chapter index and compute prev/next
  const currentIndex = chapters.findIndex((ch) => ch.id === chapterId);
  const currentChapter = currentIndex >= 0 ? chapters[currentIndex] : chapterInfo;
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex >= 0 && currentIndex < chapters.length - 1
      ? chapters[currentIndex + 1]
      : null;

  return (
    <ManhwaReader
      pages={pages}
      pagesDataSaver={pagesResult.pagesDataSaver}
      seriesId={id}
      chapterId={chapterId}
      prevChapterId={prevChapter?.id ?? null}
      nextChapterId={nextChapter?.id ?? null}
      currentChapterNumber={currentChapter?.chapter ?? null}
    />
  );
}
