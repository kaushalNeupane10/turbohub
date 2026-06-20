"use client";

import Link from "next/link";
import { X } from "lucide-react";

import { MAIN_NAVIGATION } from "@/config/navConfig";
import { useLockBodyScroll } from "@/hook/common/useLockBodyScroll";

import ThemeToggle from "@/components/common/ThemeToggle";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  useLockBodyScroll(open);

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-black/40
          transition-opacity duration-300
          ${
            open
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
      />

      {/* Drawer */}
      <aside
        aria-hidden={!open}
        className={`
          fixed left-0 top-0 z-50
          h-dvh
          w-[85vw]
          max-w-xs
          border-r border-border
          bg-bg-surface
          shadow-xl
          transition-transform duration-300 ease-out
          flex flex-col
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <h2 className="text-lg font-bold text-text-heading">Menu</h2>

          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="
              rounded-lg
              p-2
              text-text-body
              hover:bg-bg-elevated
              hover:text-brand
              transition-colors
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="space-y-1">
            {MAIN_NAVIGATION.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="
                      flex items-center gap-3
                      rounded-lg
                      px-3 py-3
                      text-text-body
                      hover:bg-bg-elevated
                      hover:text-brand
                      transition-colors
                    "
                  >
                    {Icon && <Icon size={18} />}

                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-body">Theme</span>

            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
