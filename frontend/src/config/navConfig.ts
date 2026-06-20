import type { LucideIcon } from "lucide-react";

import {
  Home,
  Info,
  Car,
  CalendarDays,
  LayoutDashboard,
  User,
  Settings,
  LogIn,
  UserPlus,
} from "lucide-react";

export type UserRole = "admin" | "owner" | "customer";

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export interface UserMenuItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export const MAIN_NAVIGATION: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "About Us",
    href: "/about",
    icon: Info,
  },
  {
    label: "Browse Vehicles",
    href: "/vehicles",
    icon: Car,
  },
  {
    label: "My Bookings",
    href: "/bookings",
    icon: CalendarDays,
  },
];

export const AUTH_NAVIGATION = {
  login: {
    label: "Login",
    href: "/auth/login",
    icon: LogIn,
  },

  signup: {
    label: "Sign Up",
    href: "/auth/register",
    icon: UserPlus,
  },
};

export const ROLE_DASHBOARD: Record<UserRole, string> = {
  admin: "/admin",
  owner: "/dashboard",
  customer: "/profile",
};

export const USER_MENU: Record<UserRole, UserMenuItem[]> = {
  admin: [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "My Profile",
      href: "/profile",
      icon: User,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ],

  owner: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Profile",
      href: "/profile",
      icon: User,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ],

  customer: [
    {
      label: "My Profile",
      href: "/profile",
      icon: User,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ],
};
