import { ThemeProvider } from '@orc/web/components/theme-provider';
import { Toaster } from '@orc/web/ui/magicui/ui/sonner';
import { cn } from '@orc/web/ui/custom-ui/utils';
import type { Metadata, Viewport } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { TailwindIndicator } from '@orc/web/components/tailwind-indicator';
import '@orc/web/ui/magicui/styles/globals.css';
import ClientSessionProvider from '@orc/web/components/client-session-provider';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});
export const metadata: Metadata = {
  title: 'ORC',
  description: 'ORC (Orphan Resurces Collector) is a k8s operator that helps you to collect orphan resources in your k8s cluster.',
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: 'black' },
    { media: '(prefers-color-scheme: light)', color: 'white' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <ClientSessionProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange enableSystem={false}>
            {children}
            <Toaster />
            <TailwindIndicator />
          </ThemeProvider>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
