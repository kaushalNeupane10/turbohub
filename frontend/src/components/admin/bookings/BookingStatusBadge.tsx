"use client";

import { BookingStatus } from "@/types/booking.types";

interface BookingStatusBadgeProps {
  status: BookingStatus;
  /** Optional: render as a small dot-only badge */
  compact?: boolean;
}

const STATUS_MAP: Record<
  BookingStatus,
  { label: string; dot: string; badge: string }
> = {
  pending: {
    label: "Pending",
    dot: "bg-warning",
    badge:
      "bg-warning/10 text-warning border border-warning/20",
  },
  approved: {
    label: "Approved",
    dot: "bg-brand",
    badge:
      "bg-brand/10 text-brand border border-brand/20",
  },
  confirmed: {
    label: "Confirmed",
    dot: "bg-success",
    badge:
      "bg-success/10 text-success border border-success/20",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-error",
    badge:
      "bg-error/10 text-error border border-error/20",
  },
  completed: {
    label: "Completed",
    dot: "bg-neutral-400",
    badge:
      "bg-neutral-500/10 text-text-muted border border-border-subtle",
  },
};

export default function BookingStatusBadge({
  status,
  compact = false,
}: BookingStatusBadgeProps) {
  const config = STATUS_MAP[status] ?? STATUS_MAP.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${config.dot}`} />
      {!compact && config.label}
    </span>
  );
}
