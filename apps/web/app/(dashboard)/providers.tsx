'use client';

import { FC, PropsWithChildren } from 'react';
import { ThemeProvider } from '@orc/web/components/theme-provider';

type ProvidersProps = PropsWithChildren;

export const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};
