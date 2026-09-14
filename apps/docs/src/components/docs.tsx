import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsPage, type DocsPageProps } from 'fumadocs-ui/layouts/docs/page';
import type { Root } from 'fumadocs-core/page-tree';
import type { MouseEvent, ReactNode } from 'react';
import { navigate } from 'astro:transitions/client';
import { RootProvider } from 'fumadocs-ui/provider/astro';
import type { AstroProviderProps } from 'fumadocs-core/framework/astro';
import SearchDialog from './search';

const landingUrl = import.meta.env.PUBLIC_LANDING_URL ?? 'http://localhost:4321';

function preventActiveFolderNavigation(event: MouseEvent<HTMLElement>) {
  if (!(event.target instanceof Element)) return;

  // Fumadocs toggles active folder links but does not cancel their navigation.
  const link = event.target.closest<HTMLAnchorElement>(
    '#nd-sidebar a[data-active="true"], #nd-sidebar-mobile a[data-active="true"]',
  );

  if (link?.querySelector(':scope > [data-icon]')) event.preventDefault();
}

export function Docs({
  tree,
  children,
  pathname,
  params,
  page,
}: {
  tree: Root;
  children: ReactNode;
  pathname: string;
  params: AstroProviderProps['params'];
  page?: DocsPageProps;
}) {
  return (
    <RootProvider
      pathname={pathname}
      params={params}
      navigate={navigate}
      theme={{ enabled: false }}
      search={{ SearchDialog }}
    >
      <DocsLayout
        tree={tree}
        containerProps={{ onClickCapture: preventActiveFolderNavigation }}
        themeSwitch={{
          enabled: false,
        }}
        nav={{
          title: <span className="font-bold tracking-[0.2em]">AXIOM</span>,
          url: '/',
        }}
        links={[{ text: 'Home', url: landingUrl, external: true }]}
      >
        <DocsPage {...page}>{children}</DocsPage>
      </DocsLayout>
    </RootProvider>
  );
}
