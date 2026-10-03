"use client";

import { BookingStatus } from "@/types/booking.types";

// ── Status configuration ──────────────────────────────────────────────────────

export const BOOKING_STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; dotClass: string; badgeClass: string; description: string }
> = {
  pending: {
    label: "Pending",
    dotClass: "bg-warning",
    badgeClass: "bg-warning/10 text-warning border border-warning/20",
    description: "Awaiting owner approval",
  },
  approved: {
    label: "Approved",
    dotClass: "bg-brand",
    badgeClass: "bg-brand/10 text-brand border border-brand/20",
    description: "Approved — complete payment to confirm",
  },
  confirmed: {
    label: "Active",
    dotClass: "bg-success animate-pulse",
    badgeClass: "bg-success/10 text-success border border-success/20",
    description: "Vehicle checked out — trip in progress",
  },
  cancelled: {
    label: "Cancelled",
    dotClass: "bg-error",
    badgeClass: "bg-error/10 text-error border border-error/20",
    description: "Booking was cancelled",
  },
  completed: {
    label: "Completed",
    dotClass: "bg-neutral-400",
    badgeClass:
      "bg-neutral-500/10 text-text-muted border border-border-subtle",
    description: "Trip completed",
  },
};

// ── Shared helpers ────────────────────────────────────────────────────────────

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(iso),
  );
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatPrice(value: string | number) {
  const num = Number(value);
  if (isNaN(num)) return "—";
  return `Rs ${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)}`;
}

export function calcDays(start: string, end: string) {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

// ── Status badge ──────────────────────────────────────────────────────────────

interface UserBookingStatusBadgeProps {
  status: BookingStatus;
  compact?: boolean;
}

export function UserBookingStatusBadge({
  status,
  compact = false,
}: UserBookingStatusBadgeProps) {
  const config = BOOKING_STATUS_CONFIG[status] ?? BOOKING_STATUS_CONFIG.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.badgeClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${config.dotClass}`} />
      {!compact && config.label}
    </span>
  );
}
