"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Calendar,
  DollarSign,
  Car,
  MapPin,
  Clock,
  ShieldCheck,
  Share2,
  RotateCw,
  AlertCircle,
  CreditCard,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useTrackBooking } from "@/hook/user/booking/useTrackBooking";
import BookingTimeline from "./BookingTimeline";
import {
  formatDate,
  formatPrice,
  calcDays,
  UserBookingStatusBadge,
} from "./bookingHelpers";

function BookingTrackerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryId = searchParams.get("id") ?? "";

  const [inputVal, setInputVal] = useState(queryId);
  const [activeSearchId, setActiveSearchId] = useState(queryId);
  const [copied, setCopied] = useState(false);

  // Sync input and search ID if URL changes externally
  useEffect(() => {
    if (queryId) {
      setInputVal(queryId);
      setActiveSearchId(queryId);
    }
  }, [queryId]);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useTrackBooking(activeSearchId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = inputVal.trim();
    if (!cleaned) return;

    setActiveSearchId(cleaned);
    router.push(`/track?id=${encodeURIComponent(cleaned)}`, { scroll: false });
  };

  const handleQuickChipClick = (idStr: string) => {
    setInputVal(idStr);
    setActiveSearchId(idStr);
    router.push(`/track?id=${encodeURIComponent(idStr)}`, { scroll: false });
  };

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const shareUrl = `${window.location.origin}/track?id=${encodeURIComponent(activeSearchId)}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Helper for payment status label
  const renderPaymentStatusBadge = (statusStr: string | null) => {
    if (!statusStr || statusStr === "pending") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning">
          <Clock size={12} />
          Payment Pending
        </span>
      );
    }
    if (statusStr === "succeeded" || statusStr === "successful") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
          <CheckCircle2 size={12} />
          Paid in Full
        </span>
      );
    }
    if (statusStr === "failed") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-error/30 bg-error/10 px-2.5 py-0.5 text-xs font-medium text-error">
          <AlertCircle size={12} />
          Payment Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-bg-surface px-2.5 py-0.5 text-xs font-medium text-text-muted capitalize">
        {statusStr}
      </span>
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-16">
      {/* Hero / Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-brand/20 bg-gradient-to-b from-brand/10 via-bg-surface to-bg-card p-6 md:p-10 shadow-2xl backdrop-blur-md">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1 text-xs font-semibold text-brand">
            <ShieldCheck size={14} />
            Public Booking Lookup
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary md:text-4xl">
            Track Your <span className="text-brand">Booking Status</span>
          </h1>
          <p className="text-sm text-text-muted md:text-base">
            No login required! Simply enter your Booking ID to view real-time
            status, vehicle schedule, owner notes, and payment updates.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter Booking ID (e.g. 15, #1, TB-15)"
                className="w-full rounded-2xl border border-border-subtle bg-bg-card/90 py-3.5 pl-11 pr-4 text-sm font-medium text-text-primary shadow-inner outline-none transition-all placeholder:text-text-muted/50 focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3.5 text-sm font-bold text-black shadow-lg transition-all duration-200 hover:bg-brand-hover hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? (
                <RotateCw size={18} className="animate-spin text-black" />
              ) : (
                <Search size={18} />
              )}
              <span>Track Booking</span>
            </button>
          </form>

          {/* Quick sample chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-text-muted">
            <span className="font-medium text-text-muted/80">Try sample IDs:</span>
            {["1", "2", "14", "15"].map((sampleId) => (
              <button
                key={sampleId}
                type="button"
                onClick={() => handleQuickChipClick(sampleId)}
                className="rounded-lg border border-border-subtle bg-bg-surface/80 px-2.5 py-1 font-mono text-xs font-semibold text-text-primary transition-colors hover:border-brand/40 hover:text-brand"
              >
                #{sampleId}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-6 rounded-3xl border border-border-subtle bg-bg-card p-6 md:p-8 animate-pulse">
          <div className="flex items-center justify-between border-b border-border-subtle pb-6">
            <div className="h-8 w-48 rounded-xl bg-border-subtle/40" />
            <div className="h-7 w-24 rounded-full bg-border-subtle/40" />
          </div>
          <div className="h-24 w-full rounded-2xl bg-border-subtle/30" />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-44 rounded-2xl bg-border-subtle/30" />
            <div className="h-44 rounded-2xl bg-border-subtle/30" />
          </div>
        </div>
      )}

      {/* Error / Not Found State */}
      {isError && !isLoading && (
        <div className="rounded-3xl border border-error/20 bg-error/5 p-8 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-error/30 bg-error/10 text-error">
            <AlertCircle size={28} />
          </div>
          <h3 className="mt-4 text-xl font-bold text-text-primary">
            Booking Not Found
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
            {(error as any)?.message ||
              `We couldn't find any booking matching ID "${activeSearchId}". Please double-check your ID and try again.`}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => {
                setInputVal("");
                setActiveSearchId("");
                router.push("/track", { scroll: false });
              }}
              className="rounded-xl border border-border-subtle bg-bg-surface px-4 py-2.5 text-xs font-semibold text-text-primary hover:border-brand/40"
            >
              Clear Search
            </button>
          </div>
        </div>
      )}

      {/* Booking Details Result View */}
      {data && !isLoading && (
        <div className="space-y-6">
          {/* Result Card Container */}
          <div className="overflow-hidden rounded-3xl border border-border-subtle bg-bg-card shadow-2xl transition-all">
            {/* Top Bar: Booking Metadata & Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle bg-bg-surface/50 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-xl border border-brand/30 bg-brand/10 px-3 py-1 font-mono text-base font-bold text-brand">
                  #{data.id}
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-text-primary">
                    Booking Overview
                  </h2>
                  <p className="text-xs text-text-muted">
                    Renter:{" "}
                    <span className="font-semibold text-text-primary">
                      {data.customer_name}
                    </span>{" "}
                    • Created on {formatDate(data.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <UserBookingStatusBadge status={data.status} />

                <button
                  type="button"
                  onClick={handleCopyLink}
                  title="Share tracking link"
                  className="flex h-9 items-center gap-1.5 rounded-xl border border-border-subtle bg-bg-surface px-3 text-xs font-semibold text-text-muted transition-colors hover:border-brand/40 hover:text-brand"
                >
                  <Share2 size={14} />
                  <span>{copied ? "Copied!" : "Share Link"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  title="Refresh status"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-subtle bg-bg-surface text-text-muted transition-colors hover:border-brand/40 hover:text-brand disabled:opacity-50"
                >
                  <RotateCw
                    size={14}
                    className={isFetching ? "animate-spin" : ""}
                  />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="space-y-8 p-6 md:p-8">
              {/* Stepper / Timeline */}
              <div className="space-y-3 rounded-2xl border border-border-subtle/80 bg-bg-surface/40 p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Progress Timeline
                  </h3>
                  <span className="text-xs font-medium text-brand">
                    Real-time status
                  </span>
                </div>
                <BookingTimeline status={data.status} />
              </div>

              {/* Detail Cards Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Vehicle Card */}
                <div className="flex flex-col justify-between rounded-2xl border border-border-subtle/80 bg-bg-surface/30 p-5 transition-colors hover:border-brand/30">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                      <Car size={14} className="text-brand" />
                      Vehicle Details
                    </div>

                    <div className="flex gap-4">
                      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-border-subtle bg-bg-card">
                        {data.vehicle_detail.cover_image ? (
                          <Image
                            src={data.vehicle_detail.cover_image}
                            alt={data.vehicle_detail.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-bg-surface text-text-muted">
                            <Car size={24} />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-text-primary">
                          {data.vehicle_detail.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="rounded-md border border-border-subtle bg-bg-card px-2 py-0.5 text-xs font-medium text-text-muted capitalize">
                            {data.vehicle_detail.vehicle_type}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-text-muted">
                            <MapPin size={12} className="text-brand" />
                            {data.vehicle_detail.location}
                          </span>
                        </div>
                        <p className="pt-1 text-xs font-semibold text-brand">
                          {formatPrice(data.vehicle_detail.price_per_day)} / day
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-border-subtle/60 pt-3">
                    <Link
                      href={`/vehicles/${data.vehicle_detail.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                    >
                      View vehicle page <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>

                {/* Rental Period Card */}
                <div className="flex flex-col justify-between rounded-2xl border border-border-subtle/80 bg-bg-surface/30 p-5 transition-colors hover:border-brand/30">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-text-muted">
                      <span className="flex items-center gap-2">
                        <Calendar size={14} className="text-brand" />
                        Rental Dates
                      </span>
                      <span className="rounded-md bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                        {calcDays(data.start_date, data.end_date)} Days
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 rounded-xl border border-border-subtle/60 bg-bg-card/50 p-4">
                      <div>
                        <p className="text-xs text-text-muted">Pick-up Date</p>
                        <p className="mt-1 text-sm font-bold text-text-primary">
                          {formatDate(data.start_date)}
                        </p>
                      </div>
                      <div className="border-l border-border-subtle/60 pl-4">
                        <p className="text-xs text-text-muted">Return Date</p>
                        <p className="mt-1 text-sm font-bold text-text-primary">
                          {formatDate(data.end_date)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-border-subtle/60 pt-3">
                    <p className="text-xs text-text-muted">
                      Total rental duration calculated strictly by day count.
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial & Payment Card */}
              <div className="rounded-2xl border border-border-subtle/80 bg-gradient-to-r from-bg-surface/60 to-bg-card p-5 md:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle/60 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                    <CreditCard size={14} className="text-brand" />
                    Financial & Payment Summary
                  </div>
                  <div>{renderPaymentStatusBadge(data.payment_status)}</div>
                </div>

                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm font-medium text-text-muted">
                    Total Estimated Price
                  </span>
                  <span className="text-2xl font-black text-brand">
                    {formatPrice(data.total_price)}
                  </span>
                </div>

                {/* Conditional Pay Now / Login Prompt CTA */}
                {data.status === "approved" &&
                  data.payment_status !== "succeeded" &&
                  data.payment_status !== "successful" && (
                    <div className="mt-4 rounded-xl border border-brand/30 bg-brand/10 p-4 space-y-3">
                      <div className="flex items-start gap-2.5">
                        <DollarSign size={18} className="text-brand mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-text-primary">
                            Owner Approved! Payment Required
                          </p>
                          <p className="text-xs text-text-muted mt-0.5">
                            Your booking has been approved by the vehicle owner.
                            Please log in to your account to complete secure online payment.
                          </p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <Link
                          href="/bookings"
                          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-black shadow transition-all hover:bg-brand-hover hover:scale-[1.01]"
                        >
                          <CreditCard size={14} />
                          Go to My Bookings to Pay Now
                        </Link>
                      </div>
                    </div>
                  )}
              </div>

              {/* Owner Notes if present */}
              {data.owner_notes && (
                <div className="rounded-2xl border border-brand/20 bg-brand/5 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-brand">
                    <MessageSquare size={14} />
                    Note from Vehicle Owner
                  </div>
                  <p className="text-sm text-text-primary italic">
                    "{data.owner_notes}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Initial Empty Search State */}
      {!activeSearchId && !isLoading && (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border-subtle bg-bg-card p-6 space-y-3 shadow-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand/30 bg-brand/10 text-brand">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-base font-bold text-text-primary">
              No Login Required
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Anyone with a valid Booking ID can track their reservation status
              instantly without signing into an account.
            </p>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-bg-card p-6 space-y-3 shadow-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand/30 bg-brand/10 text-brand">
              <Clock size={20} />
            </div>
            <h3 className="text-base font-bold text-text-primary">
              Real-time Updates
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Get live status updates on owner approval, pick-up status, and trip
              completion as soon as they happen.
            </p>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-bg-card p-6 space-y-3 shadow-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand/30 bg-brand/10 text-brand">
              <HelpCircle size={20} />
            </div>
            <h3 className="text-base font-bold text-text-primary">
              Need Help Finding ID?
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Your Booking ID is included in your booking confirmation screen
              or confirmation email (e.g. #1, #15).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PublicBookingTracker() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl p-8 text-center text-text-muted">
          <RotateCw className="mx-auto h-8 w-8 animate-spin text-brand" />
          <p className="mt-2 text-sm font-medium">Loading booking tracker...</p>
        </div>
      }
    >
      <BookingTrackerContent />
    </Suspense>
  );
}
