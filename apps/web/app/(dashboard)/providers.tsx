'use client';

import { FC, PropsWithChildren } from 'react';
import { ThemeProvider } from '@orc/web/components/theme-provider';
import ReactQueryProvider from '@orc/web/components/query-client-provider';
import { BreadcrumbsProvider } from '@orc/web/providers/breadcrumbs-provider';

type ProvidersProps = PropsWithChildren;

export const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ReactQueryProvider>
        <BreadcrumbsProvider>{children}</BreadcrumbsProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
};
