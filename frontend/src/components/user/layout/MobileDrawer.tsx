"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useLockBodyScroll } from "@/hook/common/useLockBodyScroll";
import { MAIN_NAVIGATION } from "@/config/navConfig";
import ThemeToggle from "@/components/common/ThemeToggle";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  // Lock body scroll when drawer is open
  useLockBodyScroll(open);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-black/40 transition-opacity
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      />

      {/* Drawer */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-full w-80
          bg-bg-surface border-r border-border
          shadow-xl
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <span className="text-lg font-bold text-text-heading">Menu</span>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-bg-elevated"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-4 py-4">
          {MAIN_NAVIGATION.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="
                flex items-center gap-3
                rounded-lg
                px-3 py-3
                text-text-body
                hover:bg-bg-elevated hover:text-brand
                transition-colors
              "
            >
              {item.icon && <item.icon size={18} />}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 w-full border-t border-border p-4 space-y-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-body">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
