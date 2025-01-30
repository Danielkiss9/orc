import {
  DashboardConfig,
  MainNavItem,
  SidebarNavItem,
} from '@orc/web/types';

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: 'MENU',
    items: [
      { href: '/dashboard', icon: 'dashboard', title: 'Dashboard' },
      { href: '/dashboard/test', icon: 'note', title: 'Test' },
      // { href: '/dashboard/my-lists', icon: 'scanSearch', title: 'My Lists' },
      // { href: '/dashboard/catalog', icon: 'store', title: 'Catalog' },
      // { href: '/dashboard/alerts', icon: 'alertCircle', title: 'Alerts' },
    ],
  },
  /*{
    title: 'OPTIONS',
    items: [
      { href: '/dashboard/settings', icon: 'settings', title: 'Settings' },
    ],
  },
  {
    title: 'ADMIN',
    items: [
      {
        href: '/dashboard/admin/monitor',
        icon: 'chartSpline',
        title: 'Monitor',
      },
    ],
    // authorizeOnly: Role.ADMIN,
  },*/
];

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
  },
];

export const dashboardConfig: DashboardConfig = {
  mainNav: navItems as MainNavItem[],
  sidebarNav: sidebarLinks as SidebarNavItem[],
};
