"use client";

import { CalendarOff, RefreshCw } from "lucide-react";

interface BookingEmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export default function BookingEmptyState({
  hasFilters,
  onClearFilters,
}: BookingEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 px-6 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand/8 shadow-brand/10 shadow-lg">
        <CalendarOff size={38} strokeWidth={1.25} className="text-brand/60" />
      </div>

      <div className="space-y-2 max-w-xs">
        <h3 className="text-lg font-bold text-text-heading">
          {hasFilters ? "No bookings match your filters" : "No bookings yet"}
        </h3>
        <p className="text-sm text-text-muted leading-relaxed">
          {hasFilters
            ? "Try adjusting your search or status filter to find what you're looking for."
            : "When renters request your vehicles, their booking requests will appear here."}
        </p>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="
            inline-flex items-center gap-2 rounded-xl border border-border
            px-4 py-2.5 text-sm font-semibold text-text-body
            transition hover:border-brand/40 hover:bg-brand/5 hover:text-brand
          "
        >
          <RefreshCw size={14} />
          Clear Filters
        </button>
      )}
    </div>
  );
}
