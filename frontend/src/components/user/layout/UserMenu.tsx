"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Loader2 } from "lucide-react";
import { USER_MENU } from "@/config/navConfig";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function UserMenu() {
  const { user, logout, isLoggingOut } = useAuth();

  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  if (!user) {
    return null;
  }

  const menuItems = USER_MENU[user.role];

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex items-center gap-3
          rounded-xl
          border border-border
          bg-bg-elevated
          px-3 py-2
          hover:border-brand
          transition-all
        "
      >
        {/* Avatar */}
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={user.name}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div
            className="
              h-10 w-10
              rounded-full
              bg-brand
              text-brand-foreground
              flex items-center justify-center
              font-semibold
            "
          >
            {initials}
          </div>
        )}

        <div className="hidden sm:flex flex-col items-start">
          <span className="text-sm font-semibold text-text-heading">
            {user.name}
          </span>

          <span
            className="
                rounded-full
                bg-brand/10
                px-2 py-0.5
                text-[10px]
                font-medium
                uppercase
                tracking-wide
                text-brand
            "
          >
            {user.role}
          </span>
        </div>

        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="
            absolute right-0 top-full mt-2
            w-64
            rounded-xl
            border border-border
            bg-bg-surface
            shadow-lg
            overflow-hidden
            z-50
          "
        >
          <div className="border-b border-border p-4">
            <p className="font-semibold text-text-heading">{user.name}</p>

            <p className="text-sm text-text-muted">{user.email}</p>
          </div>

          <div className="p-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="
                    flex items-center gap-3
                    rounded-lg
                    px-3 py-2.5
                    text-text-body
                    hover:bg-bg-elevated
                    hover:text-brand
                    transition-colors
                  "
                >
                  {Icon && <Icon size={18} />}

                  <span>{item.label}</span>
                </Link>
              );
            })}

            <button
              type="button"
              onClick={logout}
              disabled={isLoggingOut}
              className="
                mt-1
                flex w-full items-center gap-3
                rounded-lg
                px-3 py-2.5
                text-left
                text-error
                hover:bg-error-light/10
                transition-colors
                disabled:opacity-70
            "
            >
              {isLoggingOut ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <LogOut size={18} />
              )}

              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
