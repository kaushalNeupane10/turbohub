"use client";

import Image from "next/image";
import {
  Eye,
  CheckCircle2,
  XCircle,
  CarFront,
  Loader2,
  RefreshCw,
  Clock,
  TruckIcon,
  CornerDownLeft,
} from "lucide-react";
import BookingStatusBadge from "./BookingStatusBadge";
import { BookingDetailResponse, PaymentStatus } from "@/types/booking.types";

interface BookingTableProps {
  bookings: BookingDetailResponse[];
  approvingId: number | null;
  decliningId: number | null;
  refundingId: number | null;
  checkingOutId: number | null;
  returningId: number | null;
  onView: (booking: BookingDetailResponse) => void;
  onApprove: (id: number, notes: string) => void;
  onDecline: (id: number, notes: string) => void;
  onRefund: (id: number) => void;
  onCheckout: (id: number, notes: string) => void;
  onReturn: (id: number, notes: string) => void;
}

// ── helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(iso),
  );
}

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatPrice(value: string | number) {
  const num = Number(value);
  if (isNaN(num)) return "—";
  return `Rs ${new Intl.NumberFormat("en-IN").format(num)}`;
}

// ── Payment Badge ─────────────────────────────────────────────────────────────

function PaymentBadge({ status }: { status?: PaymentStatus }) {
  if (!status || status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[11px] font-semibold text-warning">
        <Clock size={10} />
        Awaiting Payment
      </span>
    );
  }
  if (status === "successful") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
        <CheckCircle2 size={10} />
        Paid
      </span>
    );
  }
  if (status === "refunded") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[11px] font-semibold text-purple-400">
        <RefreshCw size={10} />
        Refunded
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-error/30 bg-error/10 px-2 py-0.5 text-[11px] font-semibold text-error">
      <XCircle size={10} />
      Failed
    </span>
  );
}

// ── component ─────────────────────────────────────────────────────────────────

export default function BookingTable({
  bookings,
  approvingId,
  decliningId,
  refundingId,
  checkingOutId,
  returningId,
  onView,
  onApprove,
  onDecline,
  onRefund,
  onCheckout,
  onReturn,
}: BookingTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse text-left text-sm text-text-body">
        <thead>
          <tr className="border-b border-border-subtle bg-bg-sunken text-xs font-bold uppercase tracking-wider text-text-muted">
            <th className="px-5 py-4">Renter</th>
            <th className="px-5 py-4">Vehicle</th>
            <th className="px-5 py-4">Rental Dates</th>
            <th className="px-5 py-4">Booked On</th>
            <th className="px-5 py-4">Total</th>
            <th className="px-5 py-4">Booking / Payment</th>
            <th className="px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border-subtle">
          {bookings.map((booking) => {
            const isApproving = approvingId === booking.id;
            const isDeclining = decliningId === booking.id;
            const isRefunding = refundingId === booking.id;
            const isCheckingOut = checkingOutId === booking.id;
            const isReturning = returningId === booking.id;
            const isBusy =
              isApproving ||
              isDeclining ||
              isRefunding ||
              isCheckingOut ||
              isReturning;

            const isPending = booking.status === "pending";
            const isApproved = booking.status === "approved";
            const isConfirmed = booking.status === "confirmed";
            const isPaid = booking.payment_detail?.status === "successful";

            const coverImage = booking.vehicle_detail?.cover_image;
            const hasImage =
              coverImage &&
              (coverImage.startsWith("http") || coverImage.startsWith("/"));

            return (
              <tr
                key={booking.id}
                className="group border-b border-border-subtle transition-colors duration-150 hover:bg-bg-elevated"
              >
                {/* Renter */}
                <td className="px-5 py-4">
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-text-heading truncate group-hover:text-brand transition-colors">
                      {booking.user_detail?.full_name ?? "—"}
                    </span>
                    <span className="text-xs text-text-muted truncate mt-0.5">
                      {booking.user_detail?.email ?? "—"}
                    </span>
                  </div>
                </td>

                {/* Vehicle */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-border-subtle shadow-sm">
                      {hasImage ? (
                        <Image
                          src={coverImage}
                          alt={booking.vehicle_detail.name}
                          fill
                          className="object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-bg-sunken text-text-muted">
                          <CarFront size={18} strokeWidth={1.5} />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-text-heading truncate">
                        {booking.vehicle_detail?.name ?? "—"}
                      </span>
                      <span className="text-xs text-text-muted capitalize">
                        {booking.vehicle_detail?.vehicle_type ?? "—"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Rental Dates */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-text-body">
                      {formatDate(booking.start_date)}
                    </span>
                    <span className="text-xs text-text-muted">
                      → {formatDate(booking.end_date)}
                    </span>
                  </div>
                </td>

                {/* Booked On */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className="text-xs text-text-muted">
                    {formatDateTime(booking.created_at)}
                  </span>
                </td>

                {/* Total */}
                <td className="px-5 py-4 whitespace-nowrap font-bold text-text-heading">
                  {formatPrice(booking.total_price)}
                </td>

                {/* Booking & Payment status */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1.5 items-start">
                    <BookingStatusBadge status={booking.status} />
                    <PaymentBadge status={booking.payment_detail?.status} />
                  </div>
                </td>

                {/* Actions */}
                <td className="px-5 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    {/* View Details — always visible */}
                    <button
                      type="button"
                      onClick={() => onView(booking)}
                      aria-label={`View booking #${booking.id}`}
                      className="
                        inline-flex h-8 items-center gap-1.5 rounded-lg border border-border
                        px-3 text-xs font-semibold text-text-body
                        transition hover:border-brand/40 hover:bg-brand/5 hover:text-brand
                      "
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </button>

                    {/* Approve / Decline — for pending bookings */}
                    {isPending && (
                      <>
                        <button
                          type="button"
                          onClick={() => onApprove(booking.id, "")}
                          disabled={isBusy}
                          aria-label={`Approve booking #${booking.id}`}
                          title="Approve Booking"
                          className="
                            inline-flex h-8 items-center gap-1 rounded-lg
                            border border-success/30 bg-success/10 px-2.5 text-xs font-bold text-success
                            transition hover:bg-success/20 disabled:opacity-50 disabled:cursor-not-allowed
                          "
                        >
                          {isApproving ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={12} />
                          )}
                          <span>Approve</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDecline(booking.id, "")}
                          disabled={isBusy}
                          aria-label={`Decline booking #${booking.id}`}
                          title="Decline Booking"
                          className="
                            inline-flex h-8 items-center gap-1 rounded-lg
                            border border-error/30 bg-error/10 px-2.5 text-xs font-bold text-error
                            transition hover:bg-error/20 disabled:opacity-50 disabled:cursor-not-allowed
                          "
                        >
                          {isDeclining ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <XCircle size={12} />
                          )}
                          <span>Decline</span>
                        </button>
                      </>
                    )}

                    {/* Checkout (pickup) — for approved bookings */}
                    {isApproved && (
                      <button
                        type="button"
                        onClick={() => onView(booking)}
                        disabled={isBusy}
                        aria-label={`Mark pickup for booking #${booking.id}`}
                        title="Mark as Picked Up"
                        className="
                          inline-flex h-8 items-center gap-1 rounded-lg
                          border border-brand/30 bg-brand/10 px-2.5 text-xs font-bold text-brand
                          transition hover:bg-brand/20 disabled:opacity-50 disabled:cursor-not-allowed
                        "
                      >
                        {isCheckingOut ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <TruckIcon size={12} />
                        )}
                        <span>Pickup</span>
                      </button>
                    )}

                    {/* Return (drop-off) — for confirmed bookings */}
                    {isConfirmed && (
                      <button
                        type="button"
                        onClick={() => onView(booking)}
                        disabled={isBusy}
                        aria-label={`Mark return for booking #${booking.id}`}
                        title="Mark as Returned"
                        className="
                          inline-flex h-8 items-center gap-1 rounded-lg
                          border border-success/30 bg-success/10 px-2.5 text-xs font-bold text-success
                          transition hover:bg-success/20 disabled:opacity-50 disabled:cursor-not-allowed
                        "
                      >
                        {isReturning ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <CornerDownLeft size={12} />
                        )}
                        <span>Return</span>
                      </button>
                    )}

                    {/* Refund — available if payment was successful */}
                    {isPaid && booking.status !== "cancelled" && (
                      <button
                        type="button"
                        onClick={() => onRefund(booking.id)}
                        disabled={isBusy}
                        aria-label={`Issue refund for booking #${booking.id}`}
                        title="Issue Refund"
                        className="
                          inline-flex h-8 items-center gap-1 rounded-lg
                          border border-purple-500/30 bg-purple-500/10 px-2.5 text-xs font-bold text-purple-400
                          transition hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed
                        "
                      >
                        {isRefunding ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <RefreshCw size={12} />
                        )}
                        <span>Refund</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
