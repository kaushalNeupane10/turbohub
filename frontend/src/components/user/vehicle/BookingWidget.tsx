"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Info,
  Lock,
  ShieldCheck,
} from "lucide-react";

import Button from "@/components/ui/formFields/Button";
import { useAuth } from "@/context/AuthContext";
import { useCreateBooking } from "@/hook/user/booking/useCreateBooking";
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
 * Sticky booking panel on the vehicle detail page.
 *
 * Backend flow: create booking (pending) → owner approves → payment → Stripe.
 * Payment cannot start until the owner approves, so this widget submits the
 * rental request and then guides the user to their bookings, where the
 * "Pay now" (Stripe) action becomes available once approved.
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
  const [createdBooking, setCreatedBooking] =
    useState<BookingApiResponse | null>(null);

  const days = useMemo(
    () => daysBetween(startDate, endDate),
    [startDate, endDate],
  );
  const total = days * pricePerDay;

  const minEnd = startDate ? addDaysISO(startDate, 1) : addDaysISO(minStart, 1);

  const handleStartChange = (value: string) => {
    setStartDate(value);
    setFormError(null);
    // Keep end date valid relative to the new start date.
    if (endDate && daysBetween(value, endDate) <= 0) {
      setEndDate("");
    }
  };

  const handleSubmit = async () => {
    setFormError(null);

    if (!isAuthenticated) {
      // Send the user to login, returning them here afterwards.
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
      const booking = await createBooking.mutateAsync({
        vehicle: vehicle.id,
        start_date: startDate,
        end_date: endDate,
      });
      setCreatedBooking(booking);
    } catch (err) {
      const apiError = err as ApiError;
      setFormError(
        apiError.message ||
          "We couldn't create your booking. Please try again.",
      );
    }
  };

  // ── Success state — booking request submitted ──────────────────────────
  if (createdBooking) {
    return (
      <div className="rounded-2xl border border-border/70 bg-bg-surface p-6 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 size={30} />
          </div>
          <h3 className="mt-4 text-lg font-black text-text-heading">
            Booking request sent!
          </h3>
          <p className="mt-2 text-sm text-text-muted">
            Your request for{" "}
            <span className="font-semibold text-text-body">{vehicle.name}</span>{" "}
            is now <span className="font-semibold">pending approval</span>. Once
            the owner approves it, you can complete secure payment via Stripe
            from your bookings.
          </p>
        </div>

        <dl className="mt-5 space-y-2 rounded-xl border border-border/50 bg-bg-elevated p-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-text-muted">Dates</dt>
            <dd className="font-medium text-text-body">
              {formatDate(createdBooking.start_date)} →{" "}
              {formatDate(createdBooking.end_date)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-muted">Total</dt>
            <dd className="font-black text-brand">
              ${parseFloat(createdBooking.total_price).toFixed(2)}
            </dd>
          </div>
        </dl>

        <Link
          href="/bookings"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 font-medium text-brand-foreground transition hover:bg-brand-dark"
        >
          View my bookings
        </Link>
        <button
          onClick={() => {
            setCreatedBooking(null);
            setStartDate("");
            setEndDate("");
          }}
          className="mt-2 w-full rounded-lg px-4 py-2.5 text-sm font-medium text-text-muted transition hover:text-text-body"
        >
          Book different dates
        </button>
      </div>
    );
  }

  // ── Default state — date selection ─────────────────────────────────────
  return (
    <div className="rounded-2xl border border-border/70 bg-bg-surface p-6 shadow-lg">
      {/* Price header */}
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-3xl font-black text-brand">
            ${pricePerDay.toFixed(0)}
          </span>
          <span className="text-sm font-medium text-text-body"> / day</span>
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
            isAvailable
              ? "bg-success/10 text-success"
              : "bg-error/10 text-error"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isAvailable ? "bg-success" : "bg-error"
            }`}
          />
          {isAvailable ? "Available" : "Unavailable"}
        </span>
      </div>

      <div className="my-5 h-px bg-border/50" />

      {/* Date inputs */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="start-date"
            className="block text-sm font-medium text-text-body"
          >
            Pick-up date
          </label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              id="start-date"
              type="date"
              value={startDate}
              min={minStart}
              disabled={!isAvailable}
              onChange={(e) => handleStartChange(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg-surface py-3 pl-10 pr-4 text-text-body outline-none transition focus:border-border-focus disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="end-date"
            className="block text-sm font-medium text-text-body"
          >
            Return date
          </label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              id="end-date"
              type="date"
              value={endDate}
              min={minEnd}
              disabled={!isAvailable || !startDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setFormError(null);
              }}
              className="w-full rounded-lg border border-border bg-bg-surface py-3 pl-10 pr-4 text-text-body outline-none transition focus:border-border-focus disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>
      </div>

      {/* Price breakdown */}
      {days > 0 && (
        <dl className="mt-5 space-y-2 rounded-xl border border-border/50 bg-bg-elevated p-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-text-muted">
              ${pricePerDay.toFixed(0)} × {days} {days === 1 ? "day" : "days"}
            </dt>
            <dd className="font-medium text-text-body">${total.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between border-t border-border/50 pt-2">
            <dt className="font-bold text-text-heading">Total</dt>
            <dd className="font-black text-brand">${total.toFixed(2)}</dd>
          </div>
        </dl>
      )}

      {/* Error */}
      {formError && (
        <p className="mt-4 rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
          {formError}
        </p>
      )}

      {/* CTA */}
      <div className="mt-5">
        {!isAvailable ? (
          <Button disabled className="cursor-not-allowed">
            Currently Unavailable
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            loading={createBooking.isPending || checkingForAuth}
          >
            {isAuthenticated ? (
              "Request to Book"
            ) : (
              <>
                <Lock size={16} />
                Log in to Book
              </>
            )}
          </Button>
        )}
      </div>

      {/* Reassurance */}
      <div className="mt-5 space-y-2.5 text-xs text-text-muted">
        <p className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-brand" />
          Secure payment via Stripe after owner approval
        </p>
        <p className="flex items-start gap-2">
          <Info size={14} className="mt-0.5 shrink-0 text-brand" />
          You won&apos;t be charged until your booking is approved.
        </p>
      </div>
    </div>
  );
}
