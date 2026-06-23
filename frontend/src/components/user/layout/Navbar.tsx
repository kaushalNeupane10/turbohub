"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { MAIN_NAVIGATION, AUTH_NAVIGATION } from "@/config/navConfig";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/common/ThemeToggle";
import MobileDrawer from "./MobileDrawer";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const { user, checkingForAuth } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  const openDrawer = () => {
    setMobileOpen(true);
  };

  const closeDrawer = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-border/40 bg-bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu */}
            <button
              type="button"
              aria-label="Open menu"
              onClick={openDrawer}
              className="
                md:hidden
                rounded-lg
                border border-border
                bg-bg-elevated
                p-2.5
                text-text-body
                hover:text-brand
                transition-colors
              "
            >
              <Menu size={20} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-xl
                  bg-linear-to-br
                  from-brand
                  to-accent-light
                  text-xl
                  font-black
                  text-brand-foreground
                  shadow-brand
                "
              >
                T
              </div>

              <div>
                <span
                  className="
                    text-xl
                    font-extrabold
                    tracking-wider
                    text-text-heading
                    transition-colors
                    group-hover:text-brand
                  "
                >
                  TURBO HUB
                </span>

                <span
                  className="
                    -mt-1
                    block
                    text-[10px]
                    font-bold
                    tracking-widest
                    text-text-muted
                  "
                >
                  RENT • RIDE • EXPLORE
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {MAIN_NAVIGATION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="
                  text-sm
                  font-medium
                  text-text-body
                  transition-colors
                  hover:text-brand
                "
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Desktop Theme Toggle */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {!checkingForAuth && (
              <>
                {user ? (
                  <UserMenu />
                ) : (
                  <div className="flex items-center gap-2">
                    {/* Login */}
                    <Link
                      href={AUTH_NAVIGATION.login.href}
                      className="
                        rounded-lg
                        px-3 py-2
                        text-sm
                        font-medium
                        text-text-body
                        transition-colors
                        hover:text-brand
                      "
                    >
                      {AUTH_NAVIGATION.login.label}
                    </Link>

                    {/* Sign Up */}
                    <Link
                      href={AUTH_NAVIGATION.signup.href}
                      className="
                        rounded-lg
                        bg-brand
                        px-4 py-2
                        text-sm
                        font-semibold
                        text-brand-foreground
                        shadow-brand
                        transition-all
                        hover:bg-brand-dark
                      "
                    >
                      {AUTH_NAVIGATION.signup.label}
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <MobileDrawer open={mobileOpen} onClose={closeDrawer} />
    </>
  );
}
