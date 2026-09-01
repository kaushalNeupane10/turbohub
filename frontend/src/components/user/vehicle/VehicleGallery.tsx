"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface VehicleGalleryProps {
  images: string[];
  alt: string;
}

/**
 * Responsive image gallery with a manual slider for the vehicle detail page.
 *
 * Features:
 *  - Large primary image with prev / next arrow overlays
 *  - Dots indicator for quick navigation
 *  - Thumbnail strip beneath (when > 1 image)
 *  - Keyboard arrow navigation (← →)
 *  - Touch / pointer swipe support for mobile
 *  - Wraps around at edges (last → first, first → last)
 */
export default function VehicleGallery({ images, alt }: VehicleGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const pointerStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const count = images.length;

  // ── Navigation helpers ──────────────────────────────────────────────
  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? count - 1 : i - 1));
  }, [count]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i === count - 1 ? 0 : i + 1));
  }, [count]);

  const goTo = useCallback((idx: number) => {
    setActiveIndex(idx);
  }, []);

  // ── Keyboard navigation ─────────────────────────────────────────────
  useEffect(() => {
    if (count <= 1) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [count, goPrev, goNext]);

  // ── Pointer (touch / mouse) swipe detection ─────────────────────────
  const SWIPE_THRESHOLD = 50; // px

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartX.current = e.clientX;
    setIsSwiping(true);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isSwiping) return;
    setIsSwiping(false);

    const deltaX = e.clientX - pointerStartX.current;
    if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
      if (deltaX < 0) goNext();
      else goPrev();
    }
  };

  const handlePointerCancel = () => {
    setIsSwiping(false);
  };

  // ── Empty state ─────────────────────────────────────────────────────
  if (!count) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-border/60 bg-bg-elevated">
        <span className="text-6xl opacity-30">🚗</span>
      </div>
    );
  }

  const safeIndex = Math.min(activeIndex, count - 1);
  const activeImage = images[safeIndex];

  return (
    <div className="space-y-4">
      {/* Primary image with slider controls */}
      <div
        ref={containerRef}
        className="group/slider relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/60 bg-bg-sunken select-none"
        onPointerDown={count > 1 ? handlePointerDown : undefined}
        onPointerUp={count > 1 ? handlePointerUp : undefined}
        onPointerCancel={count > 1 ? handlePointerCancel : undefined}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${alt} image gallery`}
      >
        <Image
          src={activeImage}
          alt={`${alt} — image ${safeIndex + 1} of ${count}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover transition-opacity duration-300"
          draggable={false}
        />

        {/* Prev / Next arrows — visible on hover (desktop) and always on mobile */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Previous image"
              className={clsx(
                "absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full",
                "bg-bg-surface/80 text-text-heading shadow-lg backdrop-blur-md",
                "transition-all duration-200",
                "hover:bg-bg-surface hover:scale-110",
                // Mobile: always visible; Desktop: show on hover
                "opacity-80 sm:opacity-0 sm:group-hover/slider:opacity-100",
              )}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Next image"
              className={clsx(
                "absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full",
                "bg-bg-surface/80 text-text-heading shadow-lg backdrop-blur-md",
                "transition-all duration-200",
                "hover:bg-bg-surface hover:scale-110",
                "opacity-80 sm:opacity-0 sm:group-hover/slider:opacity-100",
              )}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {count > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === safeIndex}
                className={clsx(
                  "h-2 rounded-full transition-all duration-200",
                  i === safeIndex
                    ? "w-6 bg-brand shadow-md"
                    : "w-2 bg-white/60 hover:bg-white/90",
                )}
              />
            ))}
          </div>
        )}

        {/* Image counter badge */}
        {count > 1 && (
          <div className="absolute right-3 top-3 z-10 rounded-lg bg-bg-surface/80 px-2.5 py-1 text-xs font-bold text-text-heading backdrop-blur-md">
            {safeIndex + 1} / {count}
          </div>
        )}
      </div>

      {/* Thumbnail strip — only when there's more than one image */}
      {count > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === safeIndex}
              className={clsx(
                "relative aspect-square overflow-hidden rounded-xl border-2 transition-all",
                i === safeIndex
                  ? "border-brand ring-2 ring-brand/30"
                  : "border-border/60 opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={src}
                alt={`${alt} thumbnail ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
