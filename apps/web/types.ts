import { Icons } from './ui/custom-ui';

export type NavItem = {
  title: string;
  href: string;
  badge?: string;
  disabled?: boolean;
  external?: boolean;
  // authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};

export type MainNavItem = NavItem;

export type SidebarNavItem = {
  title: string;
  items: NavItem[];
  // authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};

export type DashboardConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};
