"use client";

/**
 * Skeleton placeholder cards shown while user's bookings are loading.
 */
export default function UserBookingsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface animate-pulse"
        >
          {/* Image placeholder */}
          <div className="h-44 bg-skeleton" />

          {/* Body */}
          <div className="p-5 space-y-4">
            {/* Type + payment badge row */}
            <div className="flex items-center justify-between gap-2">
              <div className="h-6 w-24 rounded-lg bg-skeleton" />
              <div className="h-5 w-20 rounded-full bg-skeleton" />
            </div>

            {/* Date range block */}
            <div className="rounded-xl border border-border-subtle p-3 space-y-2">
              <div className="h-4 w-48 rounded bg-skeleton" />
              <div className="h-3 w-24 rounded bg-skeleton" />
            </div>

            {/* Action row */}
            <div className="flex items-center gap-2 pt-2 border-t border-border-subtle">
              <div className="h-8 w-16 rounded-lg bg-skeleton" />
              <div className="ml-auto h-8 w-24 rounded-lg bg-skeleton" />
              <div className="h-8 w-20 rounded-lg bg-skeleton" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
