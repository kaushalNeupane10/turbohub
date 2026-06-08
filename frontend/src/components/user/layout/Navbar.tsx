"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const navLinks = [
    { label: "Cars", href: "#cars" },
    { label: "Bikes", href: "#bikes" },
    { label: "EV Scooters", href: "#ev-scooters" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Reviews", href: "#testimonials" },
    { label: "FAQs", href: "#faq" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-bg-surface/85 backdrop-blur-md">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand to-accent-light flex items-center justify-center text-brand-foreground font-black text-xl shadow-brand">
            T
          </div>

          <div>
            <span className="text-xl font-extrabold tracking-wider text-text-heading group-hover:text-brand transition-all">
              TURBO HUB
            </span>

            <span className="block text-[10px] tracking-widest text-text-muted font-bold -mt-1">
              RENT • RIDE • EXPLORE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-medium">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-text-body hover:text-brand transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* CTA */}
          <a
            href="#cars"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-brand hover:bg-brand-dark text-brand-foreground font-semibold shadow-md hover:shadow-brand transition-all duration-300"
          >
            Rent a Vehicle
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="md:hidden p-2.5 rounded-lg bg-bg-elevated border border-border/60 text-text-body hover:text-brand transition-all"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileMenuOpen
            ? "max-h-125 border-b border-border bg-bg-surface"
            : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-4 px-4 py-6 font-semibold">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-text-body hover:text-brand transition-colors py-2 border-b border-border/30"
            >
              {link.label}
            </a>
          ))}

          <a
            href="#cars"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 w-full text-center block px-5 py-3 rounded-lg bg-brand text-brand-foreground font-semibold shadow-brand"
          >
            Rent a Vehicle
          </a>
        </nav>
      </div>
    </header>
  );
}
