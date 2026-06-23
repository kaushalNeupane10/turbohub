"use client";

import clsx from "clsx";

export default function VehicleCardSkeleton() {
  return (
    <article
      className={clsx(
        "flex h-full flex-col overflow-hidden rounded-2xl",
        "border border-border/60 bg-bg-surface",
        "animate-pulse",
      )}
    >
      {/* IMAGE SKELETON */}
      <div className="relative h-56 bg-bg-sunken">
        {/* badge placeholder */}
        <div className="absolute right-3 top-3 h-6 w-16 rounded-lg bg-bg-elevated" />

        {/* availability placeholder */}
        <div className="absolute bottom-3 left-3 h-7 w-28 rounded-lg bg-bg-elevated" />
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          {/* tagline + rating */}
          <div className="mb-3 flex items-center justify-between">
            <div className="h-3 w-24 rounded bg-bg-elevated" />
            <div className="h-3 w-16 rounded bg-bg-elevated" />
          </div>

          {/* title */}
          <div className="h-6 w-3/4 rounded bg-bg-elevated" />

          {/* description */}
          <div className="mt-3 space-y-2">
            <div className="h-3 w-full rounded bg-bg-elevated" />
            <div className="h-3 w-5/6 rounded bg-bg-elevated" />
          </div>

          {/* features */}
          <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-border/40 bg-bg-page/80 p-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-5 w-5 rounded bg-bg-elevated" />
                <div className="h-3 w-12 rounded bg-bg-elevated" />
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4">
          <div className="space-y-2">
            <div className="h-3 w-16 rounded bg-bg-elevated" />
            <div className="h-6 w-24 rounded bg-bg-elevated" />
          </div>

          <div className="h-11 w-28 rounded-xl bg-bg-elevated" />
        </div>
      </div>
    </article>
  );
}
