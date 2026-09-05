import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Link = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: any }>(
  ({ href, children, ...props }, ref) => {
    const resolvedHref = typeof href === 'string' ? href : typeof href === 'object' && href?.pathname ? href.pathname : '#';
    return (
      <a ref={ref} href={resolvedHref} {...props}>
        {children}
      </a>
    );
  }
);
Link.displayName = 'StorybookI18nLink';

export const useRouter = () => ({
  push: (url: string) => console.log('[Storybook i18n router.push]', url),
  replace: (url: string) => console.log('[Storybook i18n router.replace]', url),
  back: () => console.log('[Storybook i18n router.back]'),
  forward: () => console.log('[Storybook i18n router.forward]'),
  refresh: () => console.log('[Storybook i18n router.refresh]'),
  prefetch: (url: string) => console.log('[Storybook i18n router.prefetch]', url),
});

export const usePathname = () => '/es';
export const redirect = (url: string) => console.log('[Storybook i18n redirect]', url);
