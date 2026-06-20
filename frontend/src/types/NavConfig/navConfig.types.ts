import type { LucideIcon } from "lucide-react";

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
