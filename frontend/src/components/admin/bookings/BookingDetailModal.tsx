"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  CarFront,
  User,
  MapPin,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  CreditCard,
  RefreshCw,
  Banknote,
  Hash,
  Loader2,
  TruckIcon,
  CornerDownLeft,
  AlertTriangle,
  Info,
} from "lucide-react";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/formFields/Button";
import BookingStatusBadge from "./BookingStatusBadge";
import {
  BookingDetailResponse,
  BookingPaymentDetail,
  PaymentStatus,
} from "@/types/booking.types";

interface BookingDetailModalProps {
  open: boolean;
  booking: BookingDetailResponse | null;
  isApproving: boolean;
  isDeclining: boolean;
  isRefunding: boolean;
  isCheckingOut: boolean;
  isReturning: boolean;
  onApprove: (id: number, notes: string) => void;
  onDecline: (id: number, notes: string) => void;
  onRefund: (id: number) => void;
  onCheckout: (id: number, notes: string) => void;
  onReturn: (id: number, notes: string) => void;
  onClose: () => void;
}

// ── helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(iso),
  );
}

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function formatPrice(value: string | number) {
  const num = Number(value);
  if (isNaN(num)) return "—";
  return `Rs ${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)}`;
}

function calcDays(start: string, end: string) {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

// ── Payment status config ──────────────────────────────────────────────────────

const PAYMENT_STATUS_MAP: Record<
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
    cls: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
};

// ── Info row ──────────────────────────────────────────────────────────────────

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
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border-subtle last:border-b-0">
      <div className="flex items-center gap-2 text-text-muted">
        <Icon size={14} className="shrink-0" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-sm font-semibold text-text-heading text-right">
        {value}
      </div>
    </div>
  );
}

// ── Notes textarea ────────────────────────────────────────────────────────────

function NotesField({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  label,
  hint,
  required,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  placeholder: string;
  label: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-elevated px-4 py-4">
      <div className="flex items-center gap-2 mb-1">
        <MessageSquare size={14} className="text-text-muted" />
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {label}{" "}
          {!required && (
            <span className="normal-case font-normal text-text-muted/60">
              (optional)
            </span>
          )}
        </p>
      </div>
      {hint && (
        <p className="text-xs text-text-muted/60 mb-2 flex items-start gap-1.5">
          <Info size={11} className="mt-0.5 shrink-0" />
          {hint}
        </p>
      )}
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={3}
        placeholder={placeholder}
        className="w-full resize-none rounded-xl border border-border bg-bg-surface px-4 py-3 text-sm text-text-body placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/50 disabled:opacity-50 transition"
      />
    </div>
  );
}

// ── Payment Card ──────────────────────────────────────────────────────────────

function PaymentCard({
  payment,
  onRefund,
  isRefunding,
}: {
  payment: BookingPaymentDetail | null;
  onRefund?: () => void;
  isRefunding?: boolean;
}) {
  if (!payment) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-bg-elevated p-5 flex flex-col items-center justify-center gap-2 min-h-[120px] text-center">
        <Banknote size={28} className="text-text-muted/50" />
        <p className="text-sm font-medium text-text-muted">
          No payment record yet
        </p>
        <p className="text-xs text-text-muted/70">
          Payment details will appear once the renter initiates checkout.
        </p>
      </div>
    );
  }

  const cfg = PAYMENT_STATUS_MAP[payment.status];
  const StatusIcon = cfg.icon;

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-elevated overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10">
            <CreditCard size={18} className="text-brand" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Payment Details
            </p>
            <p className="text-xs text-text-muted/70">ID #{payment.id}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.cls}`}
        >
          <StatusIcon size={12} />
          {cfg.label}
        </span>
      </div>

      {/* Detail rows */}
      <div className="divide-y divide-border-subtle px-5">
        <div className="flex items-center justify-between py-3.5">
          <span className="text-xs font-medium text-text-muted">Amount</span>
          <span className="text-sm font-bold text-text-heading">
            {formatPrice(payment.amount)}
          </span>
        </div>

        {payment.payment_method && (
          <div className="flex items-center justify-between py-3.5">
            <span className="text-xs font-medium text-text-muted">Method</span>
            <span className="text-sm font-semibold text-text-heading capitalize">
              {payment.payment_method}
            </span>
          </div>
        )}

        <div className="flex items-start justify-between gap-4 py-3.5">
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
          <div className="flex items-start justify-between gap-4 py-3.5">
            <span className="text-xs font-medium text-text-muted shrink-0 flex items-center gap-1">
              <Hash size={11} />
              Session
            </span>
            <span className="font-mono text-xs text-text-muted break-all text-right max-w-[180px] truncate">
              {payment.stripe_session_id}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between py-3.5">
          <span className="text-xs font-medium text-text-muted">Initiated</span>
          <span className="text-xs text-text-body">
            {formatDateTime(payment.created_at)}
          </span>
        </div>
      </div>

      {payment.status === "successful" && (
        <div className="mx-5 mb-4 mt-2 rounded-xl border border-success/20 bg-success/5 p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-success shrink-0" />
            <p className="text-xs text-success font-medium">
              Payment verified — payment completed by renter.
            </p>
          </div>
          {onRefund && (
            <button
              type="button"
              onClick={onRefund}
              disabled={isRefunding}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-xs font-bold text-purple-400 hover:bg-purple-500/20 transition disabled:opacity-50"
            >
              {isRefunding ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              <span>{isRefunding ? "Processing Refund..." : "Issue Refund"}</span>
            </button>
          )}
        </div>
      )}

      {payment.status === "refunded" && (
        <div className="mx-5 mb-4 mt-2 rounded-xl border border-purple-500/20 bg-purple-500/5 p-3 flex items-center gap-2 text-xs text-purple-400 font-medium">
          <RefreshCw size={14} className="shrink-0" />
          <span>Payment has been refunded to the renter.</span>
        </div>
      )}
    </div>
  );
}

// ── Decline + Refund notice ───────────────────────────────────────────────────

function DeclineRefundBanner({
  isPaid,
  onRefund,
  isRefunding,
}: {
  isPaid: boolean;
  onRefund: () => void;
  isRefunding: boolean;
}) {
  if (!isPaid) return null;
  return (
    <div className="rounded-2xl border border-warning/30 bg-warning/5 px-4 py-4 flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <AlertTriangle size={15} className="text-warning mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-warning">
            Payment was collected for this booking
          </p>
          <p className="text-xs text-text-muted mt-0.5">
            Since payment is successful, issuing a refund is required before
            declining to remain compliant.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onRefund}
        disabled={isRefunding}
        className="self-start inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-xs font-bold text-purple-400 hover:bg-purple-500/20 transition disabled:opacity-50"
      >
        {isRefunding ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <RefreshCw size={14} />
        )}
        {isRefunding ? "Processing Refund..." : "Refund & then Decline"}
      </button>
    </div>
  );
}

// ── Pickup / Drop-off track section ──────────────────────────────────────────

function PickupTrackSection({
  status,
}: {
  status: string;
}) {
  const steps = [
    {
      key: "pending",
      label: "Request Submitted",
      icon: Clock,
      desc: "Renter submitted a booking request",
    },
    {
      key: "approved",
      label: "Approved",
      icon: CheckCircle2,
      desc: "Owner approved the booking request",
    },
    {
      key: "confirmed",
      label: "Vehicle Picked Up",
      icon: TruckIcon,
      desc: "Renter collected the vehicle",
    },
    {
      key: "completed",
      label: "Vehicle Returned",
      icon: CornerDownLeft,
      desc: "Renter dropped off the vehicle",
    },
  ];

  const statusOrder = ["pending", "approved", "confirmed", "completed"];
  const currentIdx = statusOrder.indexOf(status);

  if (!["pending", "approved", "confirmed", "completed"].includes(status)) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-elevated px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
        Pickup &amp; Drop-off Track
      </p>
      <div className="space-y-0">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isPending = idx > currentIdx;

          return (
            <div key={step.key} className="flex gap-3">
              {/* Connector */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all
                    ${isDone ? "border-success bg-success/10 text-success" : ""}
                    ${isCurrent ? "border-brand bg-brand/10 text-brand" : ""}
                    ${isPending ? "border-border-subtle bg-bg-surface text-text-muted/40" : ""}
                  `}
                >
                  <Icon size={13} />
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-0.5 flex-1 my-1 min-h-[20px] rounded-full ${
                      isDone ? "bg-success/40" : "bg-border-subtle"
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className="pb-4 min-w-0">
                <p
                  className={`text-xs font-semibold ${
                    isCurrent
                      ? "text-brand"
                      : isDone
                        ? "text-success"
                        : "text-text-muted/50"
                  }`}
                >
                  {step.label}
                  {isCurrent && (
                    <span className="ml-2 inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand uppercase tracking-wider">
                      Current
                    </span>
                  )}
                </p>
                <p className={`text-xs mt-0.5 ${isPending ? "text-text-muted/40" : "text-text-muted"}`}>
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── component ─────────────────────────────────────────────────────────────────

export default function BookingDetailModal({
  open,
  booking,
  isApproving,
  isDeclining,
  isRefunding,
  isCheckingOut,
  isReturning,
  onApprove,
  onDecline,
  onRefund,
  onCheckout,
  onReturn,
  onClose,
}: BookingDetailModalProps) {
  const [notes, setNotes] = useState("");
  const isBusy =
    isApproving || isDeclining || isRefunding || isCheckingOut || isReturning;

  if (!booking) return null;

  const days = calcDays(booking.start_date, booking.end_date);
  const isPending = booking.status === "pending";
  const isApproved = booking.status === "approved";
  const isConfirmed = booking.status === "confirmed";
  const isPaid = booking.payment_detail?.status === "successful";

  const handleApprove = () => {
    onApprove(booking.id, notes.trim());
    setNotes("");
  };

  const handleDecline = () => {
    onDecline(booking.id, notes.trim());
    setNotes("");
  };

  const handleRefund = () => {
    onRefund(booking.id);
  };

  const handleCheckout = () => {
    onCheckout(booking.id, notes.trim());
    setNotes("");
  };

  const handleReturn = () => {
    onReturn(booking.id, notes.trim());
    setNotes("");
  };

  const handleClose = () => {
    setNotes("");
    onClose();
  };

  // Determine what notes field label/hint to show contextually
  const notesConfig = (() => {
    if (isPending)
      return {
        label: "Add Notes",
        placeholder: "Add a note for the renter explaining your decision…",
        hint: "This note will be visible to the renter.",
      };
    if (isApproved)
      return {
        label: "Pickup Notes",
        placeholder: "e.g. odometer reading, vehicle condition at pickup…",
        hint: "Document vehicle condition at the time of pickup for your records.",
      };
    if (isConfirmed)
      return {
        label: "Return Notes",
        placeholder: "e.g. any damages, odometer reading at return…",
        hint: "Document vehicle condition at the time of return for your records.",
      };
    return null;
  })();

  const showNotes = isPending || isApproved || isConfirmed;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="lg"
      closeOnOverlay={!isBusy}
      closeOnEsc={!isBusy}
    >
      <Modal.Header>
        <div className="flex items-center gap-3">
          <span>Booking #{booking.id}</span>
          <BookingStatusBadge status={booking.status} />
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* ── Left column ─────────────────────────────────────────── */}
            <div className="space-y-5">
              {/* Vehicle card */}
              <div className="rounded-2xl border border-border-subtle bg-bg-elevated overflow-hidden">
                <div className="relative h-36 w-full bg-bg-sunken">
                  {booking.vehicle_detail.cover_image ? (
                    <Image
                      src={booking.vehicle_detail.cover_image}
                      alt={booking.vehicle_detail.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-text-muted/40">
                      <CarFront size={40} strokeWidth={1} />
                    </div>
                  )}
                </div>

                <div className="px-4 py-4 space-y-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                    Vehicle
                  </p>

                  <InfoRow
                    icon={CarFront}
                    label="Name"
                    value={booking.vehicle_detail.name}
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

              {/* Renter info */}
              <div className="rounded-2xl border border-border-subtle bg-bg-elevated px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                  Renter
                </p>
                <InfoRow
                  icon={User}
                  label="Name"
                  value={booking.user_detail.full_name}
                />
                <InfoRow
                  icon={User}
                  label="Email"
                  value={
                    <a
                      href={`mailto:${booking.user_detail.email}`}
                      className="text-brand hover:underline break-all"
                    >
                      {booking.user_detail.email}
                    </a>
                  }
                />
              </div>

              {/* Pickup / Drop-off tracker — visible for active bookings */}
              <PickupTrackSection status={booking.status} />
            </div>

            {/* ── Right column ─────────────────────────────────────────── */}
            <div className="space-y-5">
              {/* Booking dates & summary */}
              <div className="rounded-2xl border border-border-subtle bg-bg-elevated px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                  Booking Summary
                </p>
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
                  value={`${days} day${days !== 1 ? "s" : ""}`}
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

              {/* Owner notes (if set) */}
              {booking.owner_notes && (
                <div className="rounded-2xl border border-border-subtle bg-bg-elevated px-4 py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={14} className="text-text-muted" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Owner Notes
                    </p>
                  </div>
                  <p className="text-sm text-text-body leading-relaxed">
                    {booking.owner_notes}
                  </p>
                </div>
              )}

              {/* Decline + refund warning */}
              {isPending && (
                <DeclineRefundBanner
                  isPaid={isPaid}
                  onRefund={handleRefund}
                  isRefunding={isRefunding}
                />
              )}

              {/* Payment detail */}
              <PaymentCard
                payment={booking.payment_detail}
                onRefund={isPaid && booking.status !== "cancelled" ? handleRefund : undefined}
                isRefunding={isRefunding}
              />
            </div>
          </div>

          {/* ── Contextual notes textarea ─────────────────────────────── */}
          {showNotes && notesConfig && (
            <NotesField
              id={`booking-notes-${booking.id}`}
              value={notes}
              onChange={setNotes}
              disabled={isBusy}
              label={notesConfig.label}
              placeholder={notesConfig.placeholder}
              hint={notesConfig.hint}
            />
          )}
        </div>
      </Modal.Body>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <Modal.Footer>
        <Button
          type="button"
          onClick={handleClose}
          disabled={isBusy}
          className="bg-transparent border border-border text-text-body hover:bg-bg-elevated hover:border-border-strong"
        >
          Close
        </Button>

        {/* ── Refund (when payment successful & not yet refunded) ── */}
        {isPaid && booking.status !== "cancelled" && booking.status !== "pending" && (
          <Button
            type="button"
            onClick={handleRefund}
            disabled={isBusy}
            loading={isRefunding}
            className="border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
          >
            <span className="flex items-center gap-2">
              <RefreshCw size={14} />
              {isRefunding ? "Refunding…" : "Refund Payment"}
            </span>
          </Button>
        )}

        {/* ── Pending: Approve / Decline ─────────────────────────── */}
        {isPending && (
          <>
            <Button
              type="button"
              onClick={handleDecline}
              disabled={isBusy}
              loading={isDeclining}
              className="border border-error/30 bg-error/10 text-error hover:bg-error/20"
            >
              <span className="flex items-center gap-2">
                <XCircle size={14} />
                {isDeclining ? "Declining…" : "Decline"}
              </span>
            </Button>

            <Button
              type="button"
              onClick={handleApprove}
              disabled={isBusy}
              loading={isApproving}
              className="bg-success hover:bg-success/90 text-white"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 size={14} />
                {isApproving ? "Approving…" : "Approve"}
              </span>
            </Button>
          </>
        )}

        {/* ── Approved: Mark as Picked Up (Checkout) ─────────────── */}
        {isApproved && (
          <Button
            type="button"
            onClick={handleCheckout}
            disabled={isBusy}
            loading={isCheckingOut}
            className="bg-brand hover:bg-brand-dark text-brand-foreground"
          >
            <span className="flex items-center gap-2">
              <TruckIcon size={14} />
              {isCheckingOut ? "Processing…" : "Mark as Picked Up"}
            </span>
          </Button>
        )}

        {/* ── Confirmed: Mark as Returned (Drop-off) ─────────────── */}
        {isConfirmed && (
          <Button
            type="button"
            onClick={handleReturn}
            disabled={isBusy}
            loading={isReturning}
            className="bg-success hover:bg-success/90 text-white"
          >
            <span className="flex items-center gap-2">
              <CornerDownLeft size={14} />
              {isReturning ? "Processing…" : "Mark as Returned"}
            </span>
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
