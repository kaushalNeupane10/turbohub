"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  CarFront,
  Clock,
  CreditCard,
  ChevronRight,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { BookingDetailResponse } from "@/types/booking.types";
import {
  UserBookingStatusBadge,
  formatDate,
  formatPrice,
  calcDays,
} from "./bookingHelpers";

interface UserBookingCardProps {
  booking: BookingDetailResponse;
  onViewDetail: (booking: BookingDetailResponse) => void;
  onCancel: (id: number) => void;
  onPayNow: (bookingId: number) => void;
  isCancelling: boolean;
  isPayingNow: boolean;
}

// ── Payment inline badge ──────────────────────────────────────────────────────

function PaymentPill({
  status,
}: {
  status?: string;
}) {
  if (!status || status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[11px] font-semibold text-warning">
        <Clock size={9} />
        Awaiting Payment
      </span>
    );
  }
  if (status === "successful") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
        <CreditCard size={9} />
        Paid
      </span>
    );
  }
  if (status === "refunded") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-info/30 bg-info/10 px-2 py-0.5 text-[11px] font-semibold text-info">
        Refunded
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-error/30 bg-error/10 px-2 py-0.5 text-[11px] font-semibold text-error">
      Failed
    </span>
  );
}

// ── component ─────────────────────────────────────────────────────────────────

export default function UserBookingCard({
  booking,
  onViewDetail,
  onCancel,
  onPayNow,
  isCancelling,
  isPayingNow,
}: UserBookingCardProps) {
  const days = calcDays(booking.start_date, booking.end_date);
  const isActive = ["pending", "approved"].includes(booking.status);
  const isApproved = booking.status === "approved";
  const isPaid = booking.payment_detail?.status === "successful";
  const isCancellable = ["pending", "approved"].includes(booking.status);
  const canPayNow = isApproved && !isPaid;

  return (
    <article
      id={`booking-card-${booking.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-bg-surface transition-all duration-300 hover:border-brand/30 hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* Vehicle image header */}
      <div className="relative h-44 overflow-hidden bg-bg-sunken">
        {booking.vehicle_detail.cover_image ? (
          <Image
            src={booking.vehicle_detail.cover_image}
            alt={booking.vehicle_detail.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <CarFront size={40} className="text-text-muted/20" strokeWidth={1} />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Booking ID + status */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-lg bg-bg-surface/90 px-2.5 py-1 text-xs font-bold text-text-heading backdrop-blur-md">
            #{booking.id}
          </span>
        </div>

        {/* Status badge */}
        <div className="absolute right-3 top-3">
          <UserBookingStatusBadge status={booking.status} />
        </div>

        {/* Vehicle name over image */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-sm font-black text-white drop-shadow-md line-clamp-1">
            {booking.vehicle_detail.name}
          </p>
          <div className="mt-0.5 flex items-center gap-1">
            <MapPin size={10} className="text-white/70" />
            <span className="text-xs text-white/70">
              {booking.vehicle_detail.location}
            </span>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Vehicle type badge */}
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-lg bg-brand/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-brand">
            {booking.vehicle_detail.vehicle_type}
          </span>
          <PaymentPill status={booking.payment_detail?.status} />
        </div>

        {/* Date range */}
        <div className="flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-elevated p-3">
          <Calendar size={14} className="shrink-0 text-brand" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-heading flex-wrap">
              <span>{formatDate(booking.start_date)}</span>
              <span className="text-text-muted">→</span>
              <span>{formatDate(booking.end_date)}</span>
            </div>
            <p className="mt-0.5 text-[11px] text-text-muted">
              {days} {days === 1 ? "day" : "days"} rental
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-base font-black text-brand">
              {formatPrice(booking.total_price)}
            </p>
            <p className="text-[10px] text-text-muted">total</p>
          </div>
        </div>

        {/* Owner note (if set) */}
        {booking.owner_notes && (
          <div className="flex items-start gap-2 rounded-xl border border-info/20 bg-info/5 p-3 text-xs text-text-muted">
            <AlertTriangle size={12} className="mt-0.5 shrink-0 text-info" />
            <p className="line-clamp-2 leading-relaxed">
              <span className="font-semibold text-text-body">Owner note: </span>
              {booking.owner_notes}
            </p>
          </div>
        )}

        {/* Pay Now CTA (approved + unpaid) */}
        {canPayNow && (
          <div className="rounded-xl border border-brand/20 bg-brand/5 p-3">
            <p className="text-xs font-semibold text-brand mb-2">
              🎉 Your booking is approved! Complete payment to confirm.
            </p>
            <button
              type="button"
              id={`pay-now-${booking.id}`}
              onClick={() => onPayNow(booking.id)}
              disabled={isPayingNow}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground transition-all hover:bg-brand-dark hover:shadow-brand disabled:opacity-60"
            >
              {isPayingNow ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Redirecting to Payment…
                </>
              ) : (
                <>
                  <CreditCard size={14} />
                  Pay Now
                </>
              )}
            </button>
          </div>
        )}

        {/* Action row */}
        <div className="flex items-center gap-2 pt-1 border-t border-border-subtle mt-auto">
          {/* Cancel (pending / approved only) */}
          {isCancellable && (
            <button
              type="button"
              id={`cancel-booking-${booking.id}`}
              onClick={() => onCancel(booking.id)}
              disabled={isCancelling}
              className="inline-flex items-center gap-1.5 rounded-lg border border-error/20 bg-error/5 px-3 py-2 text-xs font-semibold text-error transition-all hover:bg-error/10 hover:border-error/30 disabled:opacity-50"
            >
              {isCancelling ? (
                <Loader2 size={12} className="animate-spin" />
              ) : null}
              Cancel
            </button>
          )}

          {/* View details */}
          <button
            type="button"
            id={`view-booking-${booking.id}`}
            onClick={() => onViewDetail(booking)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-bg-elevated border border-border-subtle px-3 py-2 text-xs font-semibold text-text-body transition-all hover:border-brand/30 hover:text-brand"
          >
            View Details
            <ChevronRight size={12} />
          </button>

          {/* Vehicle details link */}
          <Link
            href={`/vehicles/${booking.vehicle_detail.id}`}
            className="inline-flex items-center gap-1 rounded-lg bg-brand/10 px-3 py-2 text-xs font-semibold text-brand transition-all hover:bg-brand/20"
          >
            <CarFront size={12} />
            Vehicle
          </Link>
        </div>
      </div>
    </article>
  );
}
