export const useRouter = () => ({
  push: (url: string) => console.log('[Storybook router.push]', url),
  replace: (url: string) => console.log('[Storybook router.replace]', url),
  back: () => console.log('[Storybook router.back]'),
  forward: () => console.log('[Storybook router.forward]'),
  refresh: () => console.log('[Storybook router.refresh]'),
  prefetch: (url: string) => console.log('[Storybook router.prefetch]', url),
});

export const usePathname = () => '/es';
export const useSearchParams = () => new URLSearchParams();
export const useParams = () => ({ locale: 'es', id: '1' });
export const useSelectedLayoutSegment = () => null;
export const useSelectedLayoutSegments = () => [];
export const redirect = (url: string) => console.log('[Storybook redirect]', url);
export const permanentRedirect = (url: string) => console.log('[Storybook permanentRedirect]', url);
export const notFound = () => console.log('[Storybook notFound]');
export const unstable_rethrow = () => {};
