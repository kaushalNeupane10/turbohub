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
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  CircleDot,
  Hospital,
  Clapperboard,
  Building2,
  FileText,
  Megaphone,
  MapPinned,
  Target,
  Code2,
} from "lucide-react";

import SignOutBtn from "./SignOutBtn";

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
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Clinics",
    href: "/admin/clinics",
    icon: Building2,
  },
  {
    name: "Hospitals",
    href: "/admin/hospitals",
    icon: Hospital,
  },
  {
    name: "VideoNews",
    href: "/admin/video",
    icon: Clapperboard,
  },
  {
    name: "Blogs",
    href: "/admin/blogs",
    icon: FileText,
  },
  {
    name: "Advertisement",
    icon: Megaphone,
    children: [
      {
        name: "Zone",
        href: "/admin/advertisement/zones",
        icon: MapPinned,
      },
      {
        name: "Campaign",
        href: "/admin/advertisement/campaigns",
        icon: Target,
      },
      {
        name: "Ads",
        href: "/admin/advertisement/ads",
        icon: Code2,
      },
    ],
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function SideBar() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const normalizePath = (path: string): string =>
    path.replace(/\/+$/, "") || "/";

  const isPathActive = useCallback(
    (targetPath: string): boolean => {
      return normalizePath(pathname ?? "/") === normalizePath(targetPath);
    },
    [pathname],
  );

  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child) =>
          isPathActive(child.href),
        );

        if (hasActiveChild) {
          setExpandedMenus((prev) =>
            prev.includes(item.name) ? prev : [...prev, item.name],
          );
        }
      }
    });
  }, [pathname, isPathActive]);

  const toggleSubmenu = (name: string): void => {
    if (!isOpen) {
      setIsOpen(true);
    }

    setExpandedMenus((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  };

  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-4 py-3 shadow-sm md:hidden">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <Image
              src="/images/logo/sanchonepal.png"
              alt="Logo"
              fill
              className="object-contain"
              sizes="32px"
            />
          </div>

          <span className="text-lg font-bold tracking-tight text-[var(--color-text-heading)]">
            Sancho <span className="text-[var(--color-accent)]">Nepal</span>
          </span>
        </div>

        <button
          type="button"
          aria-label="Toggle Menu"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-neutral-100)]"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 280 : 88,
          x: isMobile ? (mobileOpen ? 0 : -280) : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] shadow-[var(--shadow-md)] md:sticky"
      >
        {/* Logo */}
        <div className="flex h-20 items-center border-b border-[var(--color-border-subtle)] px-5">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative flex h-10 min-w-[42px] items-center justify-center rounded-xl bg-[var(--color-brand-50)]">
              <Image
                src="/images/logo/SanchoNepal.png"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-sm"
              />
            </div>

            {isOpen && (
              <motion.span
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                className="whitespace-nowrap text-xl font-extrabold text-[var(--color-text-heading)]"
              >
                Sancho <span className="text-[var(--color-accent)]">Nepal</span>
              </motion.span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="custom-scrollbar flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
          {menuItems.map((item) => {
            const hasChildren = Boolean(item.children);

            const isMenuExpanded = expandedMenus.includes(item.name);

            const isParentActive =
              hasChildren &&
              item.children?.some((child) => isPathActive(child.href));

            const isDirectActive =
              !hasChildren && isPathActive(item.href ?? "");

            return (
              <div key={item.name} className="group">
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={() => toggleSubmenu(item.name)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                      isParentActive
                        ? "bg-[var(--color-brand-50)] text-[var(--color-brand-600)]"
                        : "text-[var(--color-text-muted)] hover:bg-[var(--color-neutral-50)] hover:text-[var(--color-brand-600)]"
                    }`}
                  >
                    <item.icon
                      size={22}
                      className={
                        isParentActive
                          ? "text-[var(--color-brand-600)]"
                          : "group-hover:text-[var(--color-brand-600)]"
                      }
                    />

                    {isOpen && (
                      <>
                        <span className="flex-1 text-left text-sm font-semibold">
                          {item.name}
                        </span>

                        {isMenuExpanded ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href ?? "#"}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                      isDirectActive
                        ? "bg-[var(--color-brand)] text-white shadow-md"
                        : "text-[var(--color-text-muted)] hover:bg-[var(--color-neutral-50)] hover:text-[var(--color-brand-600)]"
                    }`}
                  >
                    <item.icon size={22} />

                    {isOpen && (
                      <span className="text-sm font-semibold">{item.name}</span>
                    )}
                  </Link>
                )}

                {/* Submenu */}
                <AnimatePresence>
                  {isOpen && hasChildren && isMenuExpanded && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                      }}
                      className="mt-1 space-y-1 overflow-hidden pl-9"
                    >
                      {item.children?.map((sub) => {
                        const isSubActive = isPathActive(sub.href);

                        return (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setMobileOpen(false)}
                            className={`relative flex items-center gap-3 py-2 text-sm transition-all ${
                              isSubActive
                                ? "font-bold text-[var(--color-brand-700)]"
                                : "text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
                            }`}
                          >
                            <CircleDot
                              size={8}
                              className={
                                isSubActive
                                  ? "fill-current text-[var(--color-brand-600)]"
                                  : "text-[var(--color-neutral-300)]"
                              }
                            />

                            {sub.name}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="space-y-3 border-t border-[var(--color-border-subtle)] p-4">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="hidden w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[var(--color-text-muted)] transition-all hover:bg-[var(--color-neutral-50)] md:flex"
          >
            {isOpen ? (
              <PanelLeftClose size={20} />
            ) : (
              <PanelLeftOpen size={20} />
            )}

            {isOpen && <span className="text-sm font-bold">Collapse View</span>}
          </button>

          <div className={`pt-2 ${!isOpen ? "flex justify-center" : ""}`}>
            <SignOutBtn showLabel={isOpen} />
          </div>
        </div>
      </motion.aside>
    </>
  );
}
