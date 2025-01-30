import { dashboardConfig } from '@orc/web/config/dashboard';
import { DashboardSidebar, MobileSheetSidebar } from '@orc/web/components/dashboard/dashboard-nav';
import MaxWidthWrapper from '@orc/web/components/shared/max-width-wrapper';
import { UserAccountNav } from '@orc/web/components/nav/user-account-nav';
import { ModeToggle } from '@orc/web/components/dashboard/mode-toggle';
import { Inter as FontSans } from 'next/font/google';
import localFont from 'next/font/local';
import { Metadata, Viewport } from 'next';
import { siteConfig } from '@orc/web/config/site';
import ExternalProviders from './external-providers';
import { cn } from '@orc/web/ui/custom-ui/utils';
import { Toaster } from '@orc/web/ui/custom-ui';
import { TailwindIndicator } from '@orc/web/components/tailwind-indicator';
import React from 'react';
import { Providers } from './providers';

import '@orc/web/ui/custom-ui/styles/globals.css';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@orc/web/lib/session';
import { authOptions } from '@orc/web/lib/auth';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontHeading = localFont({
  src: '../../assets/fonts/CalSans-SemiBold.woff2',
  variable: '--font-heading',
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [
    {
      name: 'orig',
      url: 'https://origranot.com',
    },
  ],
  creator: 'orig',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || '/login');
  }

  const links = dashboardConfig.sidebarNav;

  return (
    <div className="relative flex min-h-screen w-full">
      <DashboardSidebar links={links} />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-50 flex h-14 bg-background px-4 lg:h-[60px] xl:pr-8 xl:pl-4">
          <MaxWidthWrapper className="flex max-w-7xl items-center gap-x-3 px-0 lg:px-0 xl:px-0 2xl:px-6">
            <MobileSheetSidebar links={links} />
            <div className="w-full flex-1"></div>
            <ModeToggle />
            <UserAccountNav user={user} />
          </MaxWidthWrapper>
        </header>
        <main className="flex-1">
          <MaxWidthWrapper className="flex h-full max-w-7xl flex-col gap-4 px-4 lg:gap-6">{children}</MaxWidthWrapper>
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ExternalProviders />
      </head>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable, fontHeading.variable)}>
        <Providers>
          <DashboardLayout>{children}</DashboardLayout>
          <Toaster />
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  );
}
