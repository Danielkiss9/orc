'use client';

import React, { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarNavItem } from '@orc/web/types';
import { Menu, PanelLeftClose, PanelRightClose } from 'lucide-react';

import { cn } from '@orc/web/ui/custom-ui';
import { useMediaQuery } from '@orc/web/hooks';
import {
  ScrollArea,
  Button,
  Badge,
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
} from '@orc/web/ui/custom-ui';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@orc/web/ui/custom-ui';
import { Icons } from '@orc/web/ui/custom-ui';
// Todo: auth required
// import { useSession } from 'next-auth/react';
import { siteConfig } from '@orc/web/config/site';

interface DashboardSidebarProps {
  links: SidebarNavItem[];
}

// Todo: auth required
// const adminFilter = (
//   role: string | undefined | null,
//   link: SidebarNavItem | NavItem
// ) => {
//   return !link.authorizeOnly || (role && role == link.authorizeOnly);
// };

function RenderBadge() {
  const [count, setCount] = useState(0);

  if (!count || count === 0 || count < 0) return;
  return (
    <Badge className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full">
      {count}
    </Badge>
  );
}

export function DashboardSidebar({ links }: DashboardSidebarProps) {
  const path = usePathname();
  // Todo: auth required
  // const session = useSession();
  const { isTablet } = useMediaQuery();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(!isTablet);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  useEffect(() => {
    setIsSidebarExpanded(!isTablet);
  }, [isTablet]);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="sticky top-0 h-screen z-50">
        <ScrollArea className="h-full overflow-y-auto border-r">
          <aside
            className={cn(
              isSidebarExpanded ? 'w-[220px] xl:w-[260px]' : 'w-[68px]',
              'hidden md:block'
            )}
          >
            <div className="flex h-full max-h-screen flex-1 flex-col gap-2">
              <div className="flex h-14 items-center p-4 lg:h-[60px]">
                {isSidebarExpanded ? <h1>{siteConfig.name}</h1> : null}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto size-9 lg:size-8"
                  onClick={toggleSidebar}
                >
                  {isSidebarExpanded ? (
                    <PanelLeftClose
                      size={18}
                      className="stroke-muted-foreground"
                    />
                  ) : (
                    <PanelRightClose
                      size={18}
                      className="stroke-muted-foreground"
                    />
                  )}
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </div>

              <nav className="flex flex-1 flex-col gap-8 px-4 pt-4">
                {links
                  // .filter(adminFilter.bind(null, session.data?.user.role))
                  .map((section) => (
                    <section
                      key={section.title}
                      className="flex flex-col gap-0.5"
                    >
                      {isSidebarExpanded ? (
                        <p className="text-xs text-muted-foreground">
                          {section.title}
                        </p>
                      ) : (
                        <div className="h-4" />
                      )}
                      {section.items
                        // .filter( // Todo: auth required
                        //   adminFilter.bind(null, session?.data?.user.role)
                        // )
                        .map((item) => {
                          const Icon = Icons[item.icon || 'arrowRight'];
                          return (
                            item.href && (
                              <Fragment key={`link-fragment-${item.title}`}>
                                {isSidebarExpanded ? (
                                  <Link
                                    key={`link-${item.title}`}
                                    href={item.disabled ? '#' : item.href}
                                    className={cn(
                                      'flex items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-muted',
                                      path === item.href
                                        ? 'bg-muted'
                                        : 'text-muted-foreground hover:text-accent-foreground',
                                      item.disabled &&
                                        'cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground'
                                    )}
                                  >
                                    <Icon className="size-5" />
                                    {item.title}
                                    {item.badge && (
                                      <React.Suspense
                                        fallback={
                                          <Badge className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full">
                                            0
                                          </Badge>
                                        }
                                      >
                                        <RenderBadge />
                                      </React.Suspense>
                                    )}
                                  </Link>
                                ) : (
                                  <Tooltip key={`tooltip-${item.title}`}>
                                    <TooltipTrigger asChild>
                                      <Link
                                        key={`link-tooltip-${item.title}`}
                                        href={item.disabled ? '#' : item.href}
                                        className={cn(
                                          'flex items-center gap-3 rounded-md py-2 text-sm font-medium hover:bg-muted',
                                          path === item.href
                                            ? 'bg-muted'
                                            : 'text-muted-foreground hover:text-accent-foreground',
                                          item.disabled &&
                                            'cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground'
                                        )}
                                      >
                                        <span className="flex size-full items-center justify-center">
                                          <Icon className="size-5" />
                                        </span>
                                      </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                      {item.title}
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </Fragment>
                            )
                          );
                        })}
                    </section>
                  ))}
              </nav>
            </div>
          </aside>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}

export function MobileSheetSidebar({ links }: DashboardSidebarProps) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { isSm, isMobile } = useMediaQuery();
  // Todo: auth required
  // const session = useSession();

  if (isSm || isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="size-9 shrink-0 md:hidden"
          >
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <SheetHeader className="sr-only">Sidebar navigation</SheetHeader>
          <ScrollArea className="h-full overflow-y-auto">
            <div className="flex h-screen flex-col">
              <nav className="flex flex-1 flex-col gap-y-8 p-6 text-lg font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold w-1/3"
                >
                  PriceLink
                </Link>

                {links
                  /*.filter(adminFilter.bind(null, session.data?.user.role)) // Todo: auth required*/
                  .map((section) => (
                    <section
                      key={section.title}
                      className="flex flex-col gap-0.5"
                    >
                      <p className="text-xs text-muted-foreground">
                        {section.title}
                      </p>

                      {section.items
                        /* // Todo: auth required
                          .filter(
                          adminFilter.bind(null, session?.data?.user.role)
                        )*/
                        .map((item) => {
                          const Icon = Icons[item.icon || 'arrowRight'];
                          return (
                            item.href && (
                              <Fragment key={`link-fragment-${item.title}`}>
                                <Link
                                  key={`link-${item.title}`}
                                  onClick={() => {
                                    if (!item.disabled) setOpen(false);
                                  }}
                                  href={item.disabled ? '#' : item.href}
                                  className={cn(
                                    'flex items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-muted',
                                    path === item.href
                                      ? 'bg-muted'
                                      : 'text-muted-foreground hover:text-accent-foreground',
                                    item.disabled &&
                                      'cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground'
                                  )}
                                >
                                  <Icon className="size-5" />
                                  {item.title}
                                  {item.badge && (
                                    <React.Suspense
                                      fallback={
                                        <Badge className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full">
                                          0
                                        </Badge>
                                      }
                                    >
                                      <RenderBadge />
                                    </React.Suspense>
                                  )}
                                </Link>
                              </Fragment>
                            )
                          );
                        })}
                    </section>
                  ))}
              </nav>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="flex size-9 animate-pulse rounded-lg bg-muted md:hidden" />
  );
}
