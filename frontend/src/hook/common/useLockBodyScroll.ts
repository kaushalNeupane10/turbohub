"use client";

import { useEffect } from "react";

export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (locked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalStyle;
    }

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [locked]);
}
