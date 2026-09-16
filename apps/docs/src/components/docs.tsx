import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { DocsPage, type DocsPageProps } from 'fumadocs-ui/layouts/notebook/page';
import type { Root } from 'fumadocs-core/page-tree';
import type { MouseEvent, ReactNode } from 'react';
import { navigate } from 'astro:transitions/client';
import { RootProvider } from 'fumadocs-ui/provider/astro';
import type { AstroProviderProps } from 'fumadocs-core/framework/astro';
import SearchDialog from './search';

const landingUrl = import.meta.env.PUBLIC_LANDING_URL ?? 'http://localhost:4321';
const githubUrl = 'https://github.com/Online13/axiom';

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
      // The header switcher is the only toggle; `d` stays free for typing in the page.
      theme={{ hotKey: false }}
      search={{ SearchDialog }}
    >
      <DocsLayout
        tree={tree}
        containerProps={{ onClickCapture: preventActiveFolderNavigation }}
        // System is the default theme, so it gets its own segment rather than being hidden.
        themeSwitch={{ mode: 'light-dark-system' }}
        // Collapsing is desktop-only; the mobile drawer trigger stays.
        sidebar={{ collapsible: false }}
        // Root folders become tabs; 'navbar' puts them on their own row under the header.
        tabMode="navbar"
        // 'top' moves the logo and search out of the sidebar into a full-width header.
        nav={{
          mode: 'top',
          // Plain anchor: the logo leaves the docs for the landing page, outside the client router.
          title: (props) => (
            <a {...props} href={landingUrl}>
              <span className="font-bold tracking-[0.2em]">AXIOM</span>
            </a>
          ),
        }}
        githubUrl={githubUrl}
      >
        <DocsPage {...page}>{children}</DocsPage>
      </DocsLayout>
    </RootProvider>
  );
}
