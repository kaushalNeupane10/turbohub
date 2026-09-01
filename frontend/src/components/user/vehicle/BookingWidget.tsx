"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Info,
  Lock,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import Button from "@/components/ui/formFields/Button";
import { useAuth } from "@/context/AuthContext";
import { useCreateBooking } from "@/hook/user/booking/useCreateBooking";
import { paymentService } from "@/lib/services/payment.service";
import { ApiError } from "@/lib/api/apiClient";
import { PublicVehicleApiResponse } from "@/types/vehicle.types";
import { BookingApiResponse } from "@/types/booking.types";
import {
  addDaysISO,
  daysBetween,
  formatDate,
  todayISO,
} from "@/utils/date.utils";

interface BookingWidgetProps {
  vehicle: PublicVehicleApiResponse;
}

/**
 * Premium sticky booking panel on the vehicle detail page.
 *
 * Instant Booking & Payment Flow:
 * 1. User picks start and end dates.
 * 2. User clicks "Book Now & Pay" (or "Log in to Book").
 * 3. Server confirms booking immediately if available, returning booking + payment_id.
 * 4. Widget automatically requests Stripe checkout URL and redirects customer instantly.
 */
export default function BookingWidget({ vehicle }: BookingWidgetProps) {
  const router = useRouter();
  const { isAuthenticated, checkingForAuth } = useAuth();
  const createBooking = useCreateBooking();

  const pricePerDay = parseFloat(vehicle.price_per_day) || 0;
  const isAvailable = vehicle.status === "available";

  const minStart = todayISO();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const days = useMemo(
    () => daysBetween(startDate, endDate),
    [startDate, endDate],
  );
  const total = days * pricePerDay;

  const minEnd = startDate ? addDaysISO(startDate, 1) : addDaysISO(minStart, 1);

  const handleStartChange = (value: string) => {
    setStartDate(value);
    setFormError(null);
    if (endDate && daysBetween(value, endDate) <= 0) {
      setEndDate("");
    }
  };

  const handleInstantBooking = async () => {
    setFormError(null);

    if (!isAuthenticated) {
      const returnTo = `/vehicles/${vehicle.id}`;
      router.push(`/auth/login?next=${encodeURIComponent(returnTo)}`);
      return;
    }

    if (!startDate || !endDate) {
      setFormError("Please select both pick-up and return dates.");
      return;
    }
    if (days <= 0) {
      setFormError("Return date must be after the pick-up date.");
      return;
    }

    try {
      setIsRedirecting(true);

      // Step 1: Create booking on backend (instantly confirmed for available vehicles)
      const booking: BookingApiResponse = await createBooking.mutateAsync({
        vehicle: vehicle.id,
        start_date: startDate,
        end_date: endDate,
      });

      // Step 2: Obtain Stripe checkout session
      let paymentId = booking.payment_id;

      if (!paymentId) {
        // Fallback: create payment record if not auto-generated
        const payment = await paymentService.createPayment(booking.id);
        paymentId = payment.id;
      }

      const { checkout_url } = await paymentService.createCheckoutSession(
        paymentId,
      );

      // Step 3: Redirect user directly to Stripe Hosted Checkout
      window.location.assign(checkout_url);
    } catch (err) {
      setIsRedirecting(false);
      const apiError = err as ApiError;
      setFormError(
        apiError.message ||
          "We couldn't process your booking & payment. Please try again.",
      );
    }
  };

  const isLoading = createBooking.isPending || isRedirecting || checkingForAuth;

  return (
    <div className="rounded-2xl border border-border/80 bg-bg-surface p-6 shadow-xl backdrop-blur-sm">
      {/* Tagline Badge (if present) */}
      {vehicle.tagline && (
        <div className="mb-4 flex items-center gap-1.5 rounded-lg bg-brand/10 px-3 py-1.5 text-xs font-bold text-brand">
          <Sparkles size={14} className="shrink-0" />
          <span className="truncate">{vehicle.tagline}</span>
        </div>
      )}

      {/* Price header & status badge */}
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <span className="text-3xl font-black text-brand tabular-nums">
            ${pricePerDay.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </span>
          <span className="text-sm font-medium text-text-body"> / day</span>
        </div>

        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
            isAvailable
              ? "bg-success/15 text-success"
              : "bg-error/15 text-error"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isAvailable ? "animate-pulse bg-success" : "bg-error"
            }`}
          />
          {isAvailable ? "Instant Book" : "Unavailable"}
        </span>
      </div>

      <div className="my-5 h-px bg-border/50" />

      {/* Date Inputs */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="start-date"
            className="block text-sm font-semibold text-text-heading"
          >
            Pick-up Date
          </label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              id="start-date"
              type="date"
              value={startDate}
              min={minStart}
              disabled={!isAvailable || isLoading}
              onChange={(e) => handleStartChange(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-bg-surface py-3 pl-10 pr-4 text-sm font-medium text-text-body outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="end-date"
            className="block text-sm font-semibold text-text-heading"
          >
            Return Date
          </label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              id="end-date"
              type="date"
              value={endDate}
              min={minEnd}
              disabled={!isAvailable || !startDate || isLoading}
              onChange={(e) => {
                setEndDate(e.target.value);
                setFormError(null);
              }}
              className="w-full rounded-xl border border-border/80 bg-bg-surface py-3 pl-10 pr-4 text-sm font-medium text-text-body outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>
      </div>

      {/* Price breakdown calculation */}
      {days > 0 && (
        <dl className="mt-5 space-y-2.5 rounded-xl border border-border/60 bg-bg-elevated/50 p-4 text-sm">
          <div className="flex justify-between text-text-muted">
            <dt>
              ${pricePerDay.toFixed(0)} × {days} {days === 1 ? "day" : "days"}
            </dt>
            <dd className="font-semibold text-text-body tabular-nums">
              ${total.toFixed(2)}
            </dd>
          </div>
          <div className="flex justify-between text-text-muted">
            <dt>Service & Protection Fee</dt>
            <dd className="font-semibold text-success">Included</dd>
          </div>
          <div className="flex justify-between border-t border-border/50 pt-2.5">
            <dt className="font-bold text-text-heading">Total</dt>
            <dd className="font-black text-brand text-base tabular-nums">
              ${total.toFixed(2)}
            </dd>
          </div>
        </dl>
      )}

      {/* Error message */}
      {formError && (
        <p className="mt-4 rounded-xl border border-error/20 bg-error/10 px-3.5 py-2.5 text-xs font-semibold text-error">
          {formError}
        </p>
      )}

      {/* CTA Button */}
      <div className="mt-6">
        {!isAvailable ? (
          <Button disabled className="cursor-not-allowed py-3.5">
            Currently Unavailable
          </Button>
        ) : (
          <Button
            onClick={handleInstantBooking}
            loading={isLoading}
            className="py-3.5 shadow-md shadow-brand/20"
          >
            {isRedirecting ? (
              "Redirecting to Stripe..."
            ) : isAuthenticated ? (
              <span className="flex items-center gap-2">
                <Zap size={18} className="fill-current text-amber-300" />
                {days > 0
                  ? `Book & Pay $${total.toFixed(2)}`
                  : "Select Dates to Book"}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Lock size={16} />
                Log in to Book
              </span>
            )}
          </Button>
        )}
      </div>

      {/* Trust & Reassurance badges */}
      <div className="mt-5 space-y-2 text-xs text-text-muted border-t border-border/40 pt-4">
        <p className="flex items-center gap-2">
          <Zap size={14} className="text-amber-500 shrink-0" />
          <span>Instant reservation — auto-confirmed immediately</span>
        </p>
        <p className="flex items-center gap-2">
          <CreditCard size={14} className="text-brand shrink-0" />
          <span>Secure checkout via Stripe</span>
        </p>
        <p className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-success shrink-0" />
          <span>Full coverage & 24/7 road assistance included</span>
        </p>
      </div>
    </div>
  );
}
