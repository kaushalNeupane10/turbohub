"use client";
import { useTheme } from "@/providers/ThemeProvider";
import { Moon, Sun } from "lucide-react";
export default function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2.5 rounded-lg bg-bg-elevated border border-border/60 text-text-body hover:text-brand hover:border-brand/40 hover:shadow-brand transition-all"
      aria-label="Toggle Theme"
    >
      {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
