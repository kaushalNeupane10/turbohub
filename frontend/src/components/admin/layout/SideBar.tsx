"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import {
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  CircleDot,
  Clapperboard,
  FileText,
  Video,
} from "lucide-react";

import SignOutBtn from "./SignOutBtn";
import ThemeToggle from "@/components/common/ThemeToggle";

interface MenuChild {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface MenuItem {
  name: string;
  icon: LucideIcon;
  href?: string;
  children?: MenuChild[];
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Blogs", href: "/admin/blogs", icon: FileText },
  {
    name: "posts",
    icon: Clapperboard,
    children: [
      {
        name: "Manage Blogs",
        href: "/admin/blogs",
        icon: FileText,
      },
      {
        name: "Video Posts",
        href: "/admin/video",
        icon: Video,
      },
    ],
  },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const pathname = usePathname();

  const normalizePath = useCallback((path: string) => {
    return path?.replace(/\/+$/, "") || "/";
  }, []);

  const isPathActive = useCallback(
    (href: string) => {
      const currentPath = normalizePath(pathname);
      const targetPath = normalizePath(href);

      if (targetPath === "/admin") {
        return currentPath === targetPath;
      }

      return (
        currentPath === targetPath || currentPath.startsWith(`${targetPath}/`)
      );
    },
    [pathname, normalizePath],
  );

  const toggleSubmenu = (name: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }

    setExpandedMenus((prev: string[]) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  };

  useEffect(() => {
    menuItems.forEach((item) => {
      if (!item.children) return;

      const hasActiveChild = item.children.some((child) =>
        isPathActive(child.href),
      );

      if (hasActiveChild) {
        setExpandedMenus((prev: string[]) =>
          prev.includes(item.name) ? prev : [...prev, item.name],
        );
      }
    });
  }, [pathname, isPathActive]);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <>
      {/* Mobile Top Header */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-bg-surface/90 px-4 shadow-sm backdrop-blur-xl md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand to-accent-light flex items-center justify-center text-brand-foreground font-black text-xl shadow-brand">
            T
          </div>

          <span className="text-sm font-extrabold text-text-heading">
            Turbo <span className="text-brand">Hub</span>
          </span>
        </Link>

        <button
          type="button"
          aria-label="Toggle sidebar"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-text-body transition hover:bg-bg-elevated active:scale-95"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.button
            type="button"
            aria-label="Close sidebar overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-overlay backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 76 : 280,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className={`
          fixed left-0 top-0 z-50 flex h-screen flex-col overflow-x-hidden
          border-r border-border bg-bg-surface/95 shadow-[var(--shadow-nav)]
          backdrop-blur-xl select-none transition-transform duration-300
          md:sticky md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo Section */}
        <div className="flex h-16 shrink-0 items-center border-b border-border-subtle px-4">
          <Link
            href="/"
            className={`flex w-full min-w-0 items-center ${
              isCollapsed ? "justify-center" : "gap-3"
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand to-accent-light flex items-center justify-center text-brand-foreground font-black text-xl shadow-brand">
                T
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="min-w-0 overflow-hidden whitespace-nowrap"
                >
                  <h2 className="text-base font-extrabold leading-tight text-text-heading">
                    Turbo <span className="text-brand">Hub</span>
                  </h2>
                  <p className="text-xs font-medium text-text-muted">
                    Admin Panel
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <ThemeToggle />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="sidebar-scroll flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-3 py-4 scrollbar-none">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = Boolean(item.children);
            const isMenuExpanded = expandedMenus.includes(item.name);

            const isParentActive =
              hasChildren &&
              item.children?.some((child) => isPathActive(child.href));

            const isDirectActive =
              !hasChildren && item.href ? isPathActive(item.href) : false;

            const isActive = isParentActive || isDirectActive;

            return (
              <div key={item.name} className="relative">
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={() => toggleSubmenu(item.name)}
                    className={`
                      group relative flex w-full items-center rounded-xl px-3 py-3 text-sm font-semibold
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-brand text-brand-foreground shadow-brand"
                          : "text-text-body hover:bg-bg-elevated hover:text-brand"
                      }
                      ${isCollapsed ? "justify-center" : "gap-3"}
                    `}
                  >
                    <Icon
                      size={20}
                      className={`
                        shrink-0 transition-transform duration-200 group-hover:scale-105
                        ${isActive ? "text-brand-foreground" : "text-brand-600"}
                      `}
                    />

                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.15 }}
                          className="flex-1 overflow-hidden whitespace-nowrap text-left"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, rotate: -90 }}
                          animate={{
                            opacity: 1,
                            rotate: isMenuExpanded ? 0 : -90,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="shrink-0"
                        >
                          <ChevronDown size={16} />
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {isCollapsed && (
                      <span className="pointer-events-none absolute left-[68px] z-50 scale-95 rounded-lg bg-brand-950 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-md transition-all group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap">
                        {item.name}
                      </span>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href || "#"}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      group relative flex items-center rounded-xl px-3 py-3 text-sm font-semibold
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-brand text-brand-foreground shadow-brand"
                          : "text-text-body hover:bg-bg-elevated hover:text-brand"
                      }
                      ${isCollapsed ? "justify-center" : "gap-3"}
                    `}
                  >
                    <Icon
                      size={20}
                      className={`
                        shrink-0 transition-transform duration-200 group-hover:scale-105
                        ${isActive ? "text-brand-foreground" : "text-brand-600"}
                      `}
                    />

                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden whitespace-nowrap"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {isCollapsed && (
                      <span className="pointer-events-none absolute left-[68px] z-50 scale-95 rounded-lg bg-brand-950 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-md transition-all group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap">
                        {item.name}
                      </span>
                    )}
                  </Link>
                )}

                {/* Submenu */}
                <AnimatePresence>
                  {!isCollapsed && hasChildren && isMenuExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -4 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -4 }}
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 28,
                      }}
                      className="mt-1 overflow-hidden pl-3"
                    >
                      <div className="ml-4 space-y-1 border-l border-border-subtle pl-3">
                        {item.children?.map((sub) => {
                          const SubIcon = sub.icon || CircleDot;
                          const isSubActive = isPathActive(sub.href);

                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              onClick={() => setMobileOpen(false)}
                              className={`
                                group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold
                                transition-all duration-200
                                ${
                                  isSubActive
                                    ? "bg-brand-50 text-brand"
                                    : "text-text-muted hover:bg-bg-elevated hover:text-brand"
                                }
                              `}
                            >
                              <SubIcon
                                size={16}
                                className={`
                                  shrink-0 transition-transform duration-200 group-hover:scale-105
                                  ${
                                    isSubActive
                                      ? "text-brand"
                                      : "text-brand-500"
                                  }
                                `}
                              />

                              <span className="truncate">{sub.name}</span>

                              {isSubActive && (
                                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand" />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="shrink-0 border-t border-border-subtle p-3">
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className={`
              mb-2 hidden w-full items-center rounded-xl px-3 py-2.5 text-sm font-bold
              text-text-muted transition hover:bg-bg-elevated hover:text-brand md:flex
              ${isCollapsed ? "justify-center" : "gap-3"}
            `}
          >
            {isCollapsed ? (
              <PanelLeftOpen size={20} className="shrink-0" />
            ) : (
              <PanelLeftClose size={20} className="shrink-0" />
            )}

            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <div className={isCollapsed ? "flex justify-center" : ""}>
            <SignOutBtn showLabel={!isCollapsed} />
          </div>
        </div>
      </motion.aside>
    </>
  );
}
