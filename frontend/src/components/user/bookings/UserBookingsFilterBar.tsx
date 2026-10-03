"use client";

import { BookingStatus } from "@/types/booking.types";

// ── Tab config ────────────────────────────────────────────────────────────────

export type BookingFilterStatus = "all" | BookingStatus;

interface FilterTab {
  key: BookingFilterStatus;
  label: string;
}

const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "confirmed", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface UserBookingsFilterBarProps {
  activeFilter: BookingFilterStatus;
  counts: Partial<Record<BookingFilterStatus, number>>;
  onFilterChange: (filter: BookingFilterStatus) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function UserBookingsFilterBar({
  activeFilter,
  counts,
  onFilterChange,
}: UserBookingsFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTER_TABS.map(({ key, label }) => {
        const count = counts[key] ?? 0;
        const isActive = activeFilter === key;

        return (
          <button
            key={key}
            type="button"
            id={`booking-filter-${key}`}
            onClick={() => onFilterChange(key)}
            className={[
              "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200",
              isActive
                ? "bg-brand text-brand-foreground shadow-brand"
                : "bg-bg-elevated border border-border-subtle text-text-body hover:border-brand/30 hover:text-brand",
            ].join(" ")}
          >
            {label}
            {count > 0 && (
              <span
                className={[
                  "rounded-full px-1.5 py-0.5 text-xs font-bold leading-none",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-brand/10 text-brand",
                ].join(" ")}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
