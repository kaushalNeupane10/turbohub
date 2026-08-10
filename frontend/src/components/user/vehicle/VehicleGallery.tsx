"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

interface VehicleGalleryProps {
  images: string[];
  alt: string;
}

/**
 * Responsive image gallery for the vehicle detail page.
 * Large primary image with a thumbnail strip beneath. Falls back to a
 * placeholder when the vehicle has no images.
 */
export default function VehicleGallery({ images, alt }: VehicleGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-border/60 bg-bg-elevated">
        <span className="text-6xl opacity-30">🚗</span>
      </div>
    );
  }

  const activeImage = images[Math.min(activeIndex, images.length - 1)];

  return (
    <div className="space-y-4">
      {/* Primary image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/60 bg-bg-sunken">
        <Image
          src={activeImage}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
      </div>

      {/* Thumbnail strip — only when there's more than one image */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === activeIndex}
              className={clsx(
                "relative aspect-square overflow-hidden rounded-xl border-2 transition-all",
                i === activeIndex
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
