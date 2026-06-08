"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";

export default function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  //   if (!mounted) {
  //     return (
  //       <button
  //         type="button"
  //         className="p-2.5 rounded-lg bg-bg-elevated border border-border"
  //       />
  //     );
  //   }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2.5 rounded-lg bg-bg-elevated border border-border text-text-body hover:text-brand transition-all"
      aria-label="Toggle Theme"
    >
      {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
