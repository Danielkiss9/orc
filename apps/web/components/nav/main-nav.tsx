'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

import { MainNavItem } from '@orc/web/types';
import { cn } from '@orc/web/ui/custom-ui';

interface MainNavProps {
  items?: MainNavItem[];
  children?: React.ReactNode;
  hideItemsOnDesktop?: boolean;
}

export function MainNav({
  items,
  children,
  hideItemsOnDesktop = false,
}: MainNavProps) {
  const segment = useSelectedLayoutSegment();

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="items-center space-x-2 z-50">
        Pricelink
      </Link>
      {items?.length && !hideItemsOnDesktop ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? '#' : item.href}
              className={cn(
                'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
                item.href.startsWith(`/${segment}`)
                  ? 'text-foreground'
                  : 'text-foreground/60',
                item.disabled && 'cursor-not-allowed opacity-80'
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
