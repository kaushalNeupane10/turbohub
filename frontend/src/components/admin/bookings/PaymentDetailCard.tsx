"use client";

import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Hash,
  Banknote,
  Building2,
  Wallet,
} from "lucide-react";
import { PaymentStatus } from "@/types/booking.types";

interface PaymentDetailCardProps {
  paymentId: number | null | undefined;
  amount: string;
  currency?: string;
  status?: PaymentStatus;
  transactionId?: string | null;
  paymentMethod?: string;
  stripeSessionId?: string | null;
  createdAt?: string;
}

// ── helpers ──────────────────────────────────────────────────────────────────

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
    cls: "text-info bg-info/10 border-info/20",
  },
};

const METHOD_ICON: Record<string, React.ElementType> = {
  card: CreditCard,
  wallet: Wallet,
  bank: Building2,
};

function formatCurrency(amount: string, currency = "USD") {
  const num = parseFloat(amount);
  if (isNaN(num)) return "—";
  // Use en-IN formatting for Rs (Nepali Rupee context), fall back to locale
  return `Rs ${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)}`;
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

// ── component ─────────────────────────────────────────────────────────────────

export default function PaymentDetailCard({
  paymentId,
  amount,
  currency = "USD",
  status,
  transactionId,
  paymentMethod,
  stripeSessionId,
  createdAt,
}: PaymentDetailCardProps) {
  /* No payment record exists yet (booking still pending / not yet paid) */
  if (!paymentId) {
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

  const paymentStatus = status ?? "pending";
  const statusCfg = PAYMENT_STATUS_MAP[paymentStatus];
  const StatusIcon = statusCfg.icon;
  const MethodIcon = paymentMethod ? (METHOD_ICON[paymentMethod] ?? CreditCard) : CreditCard;

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-elevated overflow-hidden">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10">
            <CreditCard size={18} className="text-brand" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Payment Details
            </p>
            <p className="text-xs text-text-muted/70">ID #{paymentId}</p>
          </div>
        </div>

        {/* Payment status pill */}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusCfg.cls}`}
        >
          <StatusIcon size={12} />
          {statusCfg.label}
        </span>
      </div>

      {/* Detail rows */}
      <div className="divide-y divide-border-subtle px-5">
        {/* Amount */}
        <div className="flex items-center justify-between py-3.5">
          <span className="text-xs font-medium text-text-muted">Amount</span>
          <span className="text-sm font-bold text-text-heading">
            {formatCurrency(amount, currency)}
          </span>
        </div>

        {/* Payment Method */}
        {paymentMethod && (
          <div className="flex items-center justify-between py-3.5">
            <span className="text-xs font-medium text-text-muted">Method</span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-heading capitalize">
              <MethodIcon size={14} className="text-text-muted" />
              {paymentMethod}
            </span>
          </div>
        )}

        {/* Transaction ID */}
        <div className="flex items-start justify-between gap-4 py-3.5">
          <span className="text-xs font-medium text-text-muted shrink-0">
            Transaction ID
          </span>
          {transactionId ? (
            <span className="font-mono text-xs text-brand break-all text-right">
              {transactionId}
            </span>
          ) : (
            <span className="text-xs text-text-muted/60 italic">
              Pending payment
            </span>
          )}
        </div>

        {/* Stripe Session */}
        {stripeSessionId && (
          <div className="flex items-start justify-between gap-4 py-3.5">
            <span className="text-xs font-medium text-text-muted shrink-0 flex items-center gap-1">
              <Hash size={11} />
              Session
            </span>
            <span className="font-mono text-xs text-text-muted break-all text-right max-w-[180px] truncate">
              {stripeSessionId}
            </span>
          </div>
        )}

        {/* Payment Date */}
        {createdAt && (
          <div className="flex items-center justify-between py-3.5">
            <span className="text-xs font-medium text-text-muted">
              Initiated
            </span>
            <span className="text-xs text-text-body">{formatDate(createdAt)}</span>
          </div>
        )}
      </div>

      {/* Verification banner for successful payments */}
      {paymentStatus === "successful" && transactionId && (
        <div className="mx-5 mb-4 mt-1 rounded-xl border border-success/20 bg-success/5 px-4 py-3 flex items-center gap-3">
          <CheckCircle2 size={16} className="text-success shrink-0" />
          <p className="text-xs text-success font-medium">
            Payment verified — transaction recorded successfully.
          </p>
        </div>
      )}
    </div>
  );
}
