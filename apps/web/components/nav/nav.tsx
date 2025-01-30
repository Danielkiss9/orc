'use client';
import { useScroll } from '@orc/web/hooks';
import { MainNavItem } from '@orc/web/types';
import { User } from 'next-auth';
import { MainNav } from './main-nav';
import { Button, Skeleton, Icons } from '@orc/web/ui/custom-ui';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface NavBarProps {
  user: Pick<User, 'name' | 'image' | 'email'> | undefined;
  items?: MainNavItem[];
  children?: React.ReactNode;
  rightElements?: React.ReactNode;
  scroll?: boolean;
}

export function NavBar({
  items,
  children,
  scroll = false,
}: NavBarProps) {
  const scrolled = useScroll(50);
  const { data: session, status } = useSession();
  console.log("session", session);
  return (
    <header
      className={`sticky top-0 z-40 flex w-full justify-center bg-background/60 backdrop-blur-xl transition-all ${
        scroll ? (scrolled ? 'border-b' : 'bg-background/0') : 'border-b'
      }`}
    >
      <div className="container flex h-16 items-center justify-between py-4">
        <MainNav items={items}>{children}</MainNav>

        <div className="flex items-center space-x-3">
          {session ? (
            <div className="items-center space-x-3 hidden md:flex">
              <Link href="/dashboard">
                <Button
                  className="hidden gap-2 px-4 md:flex"
                  variant="default"
                  size="sm"
                >
                  <span>Dashboard</span>
                </Button>
              </Link>
            </div>
          ) : status === 'unauthenticated' ? (
            <Link href="/login">
              <Button
                className="hidden gap-2 px-4 md:flex"
                variant="default"
                size="sm"
              >
                <span>Sign In</span>
                <Icons.arrowRight className="size-4" />
              </Button>
            </Link>
          ) : (
            <div className="hidden lg:flex">
              <Skeleton className="h-9 w-24" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
