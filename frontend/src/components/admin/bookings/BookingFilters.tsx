"use client";

import { Search, Filter, X } from "lucide-react";
import { BookingStatus } from "@/types/booking.types";

const STATUS_OPTIONS: { value: BookingStatus | ""; label: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

interface BookingFiltersProps {
  search: string;
  status: BookingStatus | "";
  hasFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: BookingStatus | "") => void;
  onClearFilters: () => void;
}

export default function BookingFilters({
  search,
  status,
  hasFilters,
  onSearchChange,
  onStatusChange,
  onClearFilters,
}: BookingFiltersProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border-subtle px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative flex-1 min-w-0 max-w-sm">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          id="booking-search"
          type="search"
          placeholder="Search renter name or email…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="
            w-full rounded-xl border border-border bg-bg-sunken
            py-2 pl-9 pr-4 text-sm text-text-body placeholder-text-muted
            outline-none ring-0 transition
            focus:border-border-focus focus:ring-2 focus:ring-brand/20
          "
        />
      </div>

      {/* Status filter + clear */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Filter
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <select
            id="booking-status-filter"
            value={status}
            onChange={(e) =>
              onStatusChange(e.target.value as BookingStatus | "")
            }
            className="
              rounded-xl border border-border bg-bg-sunken
              py-2 pl-8 pr-8 text-sm text-text-body
              outline-none ring-0 transition appearance-none cursor-pointer
              focus:border-border-focus focus:ring-2 focus:ring-brand/20
            "
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            aria-label="Clear filters"
            className="
              inline-flex items-center gap-1.5 rounded-xl border border-border
              px-3 py-2 text-xs font-semibold text-text-muted
              transition hover:border-error/40 hover:bg-error/5 hover:text-error
            "
          >
            <X size={13} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
