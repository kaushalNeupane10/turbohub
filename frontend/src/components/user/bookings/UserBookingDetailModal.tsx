"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  CarFront,
  CreditCard,
  Clock,
  CheckCircle2,
  RefreshCw,
  XCircle,
  MessageSquare,
  Loader2,
  ExternalLink,
  Hash,
  DollarSign,
} from "lucide-react";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/formFields/Button";
import BookingTimeline from "./BookingTimeline";
import { UserBookingStatusBadge, formatDate, formatDateTime, formatPrice, calcDays } from "./bookingHelpers";
import { BookingDetailResponse, PaymentStatus } from "@/types/booking.types";

// ── Props ─────────────────────────────────────────────────────────────────────

interface UserBookingDetailModalProps {
  open: boolean;
  booking: BookingDetailResponse | null;
  isCancelling: boolean;
  isPayingNow: boolean;
  onCancel: (id: number) => void;
  onPayNow: (id: number) => void;
  onClose: () => void;
}

// ── Payment status map ────────────────────────────────────────────────────────

const PAYMENT_STATUS: Record<
  PaymentStatus,
  { label: string; icon: React.ElementType; cls: string }
> = {
  pending: {
    label: "Awaiting Payment",
    icon: Clock,
    cls: "text-warning bg-warning/10 border-warning/20",
  },
  successful: {
    label: "Payment Successful",
    icon: CheckCircle2,
    cls: "text-success bg-success/10 border-success/20",
  },
  failed: {
    label: "Payment Failed",
    icon: XCircle,
    cls: "text-error bg-error/10 border-error/20",
  },
  refunded: {
    label: "Refunded",
    icon: RefreshCw,
    cls: "text-info bg-info/10 border-info/20",
  },
};

// ── InfoRow ───────────────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border-subtle last:border-b-0">
      <div className="flex items-center gap-2 text-text-muted shrink-0">
        <Icon size={13} className="shrink-0" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-sm font-semibold text-text-heading text-right break-all">
        {value}
      </div>
    </div>
  );
}

// ── Section title ─────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
      {children}
    </p>
  );
}

// ── Payment section ───────────────────────────────────────────────────────────

function PaymentSection({
  booking,
  onPayNow,
  isPayingNow,
}: {
  booking: BookingDetailResponse;
  onPayNow: () => void;
  isPayingNow: boolean;
}) {
  const payment = booking.payment_detail;
  const isApproved = booking.status === "approved";
  const isPaid = payment?.status === "successful";
  const canPayNow = isApproved && !isPaid;

  if (!payment) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-bg-elevated p-5 flex flex-col items-center justify-center gap-2 min-h-[100px] text-center">
        <CreditCard size={24} className="text-text-muted/40" />
        <p className="text-sm font-medium text-text-muted">No payment yet</p>
        {canPayNow && (
          <button
            type="button"
            onClick={onPayNow}
            disabled={isPayingNow}
            className="mt-1 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-brand-foreground transition-all hover:bg-brand-dark disabled:opacity-60"
          >
            {isPayingNow ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <CreditCard size={14} />
            )}
            {isPayingNow ? "Redirecting…" : "Pay Now"}
          </button>
        )}
      </div>
    );
  }

  const cfg = PAYMENT_STATUS[payment.status];
  const StatusIcon = cfg.icon;

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-elevated overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand/10">
            <CreditCard size={16} className="text-brand" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Payment
            </p>
            <p className="text-[11px] text-text-muted/70">ID #{payment.id}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.cls}`}
        >
          <StatusIcon size={11} />
          {cfg.label}
        </span>
      </div>

      {/* Details */}
      <div className="divide-y divide-border-subtle px-4">
        <div className="flex items-center justify-between py-3">
          <span className="text-xs font-medium text-text-muted">Amount</span>
          <span className="text-sm font-bold text-text-heading">
            {formatPrice(payment.amount)}
          </span>
        </div>

        {payment.payment_method && (
          <div className="flex items-center justify-between py-3">
            <span className="text-xs font-medium text-text-muted">Method</span>
            <span className="text-sm font-semibold text-text-heading capitalize">
              {payment.payment_method}
            </span>
          </div>
        )}

        <div className="flex items-start justify-between gap-4 py-3">
          <span className="text-xs font-medium text-text-muted shrink-0">
            Transaction ID
          </span>
          {payment.transaction_id ? (
            <span className="font-mono text-xs text-brand break-all text-right">
              {payment.transaction_id}
            </span>
          ) : (
            <span className="text-xs text-text-muted/60 italic">
              Not yet processed
            </span>
          )}
        </div>

        {payment.stripe_session_id && (
          <div className="flex items-start justify-between gap-4 py-3">
            <span className="text-xs font-medium text-text-muted shrink-0 flex items-center gap-1">
              <Hash size={10} />
              Session
            </span>
            <span className="font-mono text-xs text-text-muted break-all text-right max-w-[160px] truncate">
              {payment.stripe_session_id}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between py-3">
          <span className="text-xs font-medium text-text-muted">Date</span>
          <span className="text-xs text-text-body">
            {formatDateTime(payment.created_at)}
          </span>
        </div>
      </div>

      {/* Pay Now CTA */}
      {canPayNow && (
        <div className="mx-4 mb-4 mt-1 rounded-xl border border-brand/20 bg-brand/5 p-3">
          <p className="text-xs text-brand font-medium mb-2">
            Complete your payment to confirm this booking.
          </p>
          <button
            type="button"
            onClick={onPayNow}
            disabled={isPayingNow}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground transition-all hover:bg-brand-dark disabled:opacity-60"
          >
            {isPayingNow ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <CreditCard size={14} />
            )}
            {isPayingNow ? "Redirecting to Payment…" : "Pay Now"}
          </button>
        </div>
      )}

      {payment.status === "successful" && (
        <div className="mx-4 mb-4 mt-1 rounded-xl border border-success/20 bg-success/5 p-3 flex items-center gap-2">
          <CheckCircle2 size={14} className="text-success shrink-0" />
          <p className="text-xs text-success font-medium">
            Payment verified — your booking is confirmed.
          </p>
        </div>
      )}

      {payment.status === "refunded" && (
        <div className="mx-4 mb-4 mt-1 rounded-xl border border-info/20 bg-info/5 p-3 flex items-center gap-2">
          <RefreshCw size={14} className="text-info shrink-0" />
          <p className="text-xs text-info font-medium">
            Payment refunded. Funds should appear within 5–7 business days.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function UserBookingDetailModal({
  open,
  booking,
  isCancelling,
  isPayingNow,
  onCancel,
  onPayNow,
  onClose,
}: UserBookingDetailModalProps) {
  if (!booking) return null;

  const days = calcDays(booking.start_date, booking.end_date);
  const isCancellable = ["pending", "approved"].includes(booking.status);

  const handleCancel = () => {
    onCancel(booking.id);
  };

  const handlePayNow = () => {
    onPayNow(booking.id);
  };

  const isBusy = isCancelling || isPayingNow;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      closeOnOverlay={!isBusy}
      closeOnEsc={!isBusy}
    >
      <Modal.Header>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-text-heading font-bold">
            Booking #{booking.id}
          </span>
          <UserBookingStatusBadge status={booking.status} />
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* ── Left column ─────────────────────────── */}
            <div className="space-y-5">
              {/* Vehicle card */}
              <div className="rounded-2xl border border-border-subtle bg-bg-elevated overflow-hidden">
                <div className="relative h-40 w-full bg-bg-sunken">
                  {booking.vehicle_detail.cover_image ? (
                    <Image
                      src={booking.vehicle_detail.cover_image}
                      alt={booking.vehicle_detail.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-text-muted/30">
                      <CarFront size={40} strokeWidth={1} />
                    </div>
                  )}
                </div>
                <div className="px-4 py-4">
                  <SectionTitle>Vehicle</SectionTitle>
                  <InfoRow
                    icon={CarFront}
                    label="Name"
                    value={
                      <span className="flex items-center gap-1.5">
                        {booking.vehicle_detail.name}
                        <Link
                          href={`/vehicles/${booking.vehicle_detail.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand hover:text-brand-dark"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={11} />
                        </Link>
                      </span>
                    }
                  />
                  <InfoRow
                    icon={CarFront}
                    label="Type"
                    value={
                      <span className="inline-flex items-center rounded-lg bg-brand/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-brand">
                        {booking.vehicle_detail.vehicle_type}
                      </span>
                    }
                  />
                  <InfoRow
                    icon={MapPin}
                    label="Location"
                    value={booking.vehicle_detail.location}
                  />
                  <InfoRow
                    icon={DollarSign}
                    label="Rate / Day"
                    value={formatPrice(booking.vehicle_detail.price_per_day)}
                  />
                </div>
              </div>

              {/* Booking timeline */}
              <div className="rounded-2xl border border-border-subtle bg-bg-elevated px-4 py-4">
                <SectionTitle>Booking Journey</SectionTitle>
                <BookingTimeline status={booking.status} />
              </div>
            </div>

            {/* ── Right column ─────────────────────────── */}
            <div className="space-y-5">
              {/* Booking summary */}
              <div className="rounded-2xl border border-border-subtle bg-bg-elevated px-4 py-4">
                <SectionTitle>Booking Summary</SectionTitle>
                <InfoRow
                  icon={Calendar}
                  label="Booked On"
                  value={formatDateTime(booking.created_at)}
                />
                <InfoRow
                  icon={Calendar}
                  label="Start Date"
                  value={formatDate(booking.start_date)}
                />
                <InfoRow
                  icon={Calendar}
                  label="End Date"
                  value={formatDate(booking.end_date)}
                />
                <InfoRow
                  icon={Calendar}
                  label="Duration"
                  value={`${days} ${days === 1 ? "day" : "days"}`}
                />
                <InfoRow
                  icon={DollarSign}
                  label="Total Price"
                  value={
                    <span className="text-brand font-bold text-base">
                      {formatPrice(booking.total_price)}
                    </span>
                  }
                />
                <InfoRow
                  icon={Clock}
                  label="Last Updated"
                  value={formatDateTime(booking.updated_at)}
                />
              </div>

              {/* Owner notes */}
              {booking.owner_notes && (
                <div className="rounded-2xl border border-border-subtle bg-bg-elevated px-4 py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={13} className="text-text-muted" />
                    <SectionTitle>Message from Owner</SectionTitle>
                  </div>
                  <p className="text-sm text-text-body leading-relaxed">
                    {booking.owner_notes}
                  </p>
                </div>
              )}

              {/* Payment */}
              <PaymentSection
                booking={booking}
                onPayNow={handlePayNow}
                isPayingNow={isPayingNow}
              />
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          type="button"
          onClick={onClose}
          disabled={isBusy}
          className="bg-transparent border border-border text-text-body hover:bg-bg-elevated hover:border-border-strong"
        >
          Close
        </Button>

        {isCancellable && (
          <Button
            type="button"
            onClick={handleCancel}
            disabled={isBusy}
            loading={isCancelling}
            className="border border-error/30 bg-error/10 text-error hover:bg-error/20"
          >
            {isCancelling ? "Cancelling…" : "Cancel Booking"}
          </Button>
        )}

        {booking.status === "approved" &&
          booking.payment_detail?.status !== "successful" && (
            <Button
              type="button"
              onClick={handlePayNow}
              disabled={isBusy}
              loading={isPayingNow}
              className="bg-brand text-brand-foreground hover:bg-brand-dark"
            >
              <span className="flex items-center gap-2">
                <CreditCard size={14} />
                {isPayingNow ? "Redirecting…" : "Pay Now"}
              </span>
            </Button>
          )}
      </Modal.Footer>
    </Modal>
  );
}
