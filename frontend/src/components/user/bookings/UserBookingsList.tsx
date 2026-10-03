"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  RefreshCw,
  AlertCircle,
  SearchX,
} from "lucide-react";
import { useFetchMyBookings } from "@/hook/user/booking/useFetchMyBookings";
import { useCancelMyBooking } from "@/hook/user/booking/useCancelMyBooking";
import { useBookingCheckout } from "@/hook/user/booking/useBookingCheckout";
import UserBookingCard from "./UserBookingCard";
import UserBookingDetailModal from "./UserBookingDetailModal";
import UserBookingsSkeleton from "./UserBookingsSkeleton";
import UserBookingsFilterBar, {
  BookingFilterStatus,
} from "./UserBookingsFilterBar";
import { BookingDetailResponse, BookingStatus } from "@/types/booking.types";

// ── Stats card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border-subtle bg-bg-surface p-4 text-center gap-1 min-w-[80px]">
      <span className={`text-2xl font-black tabular-nums ${color}`}>
        {value}
      </span>
      <span className="text-xs font-medium text-text-muted">{label}</span>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ filtered }: { filtered: boolean }) {
  if (filtered) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border-subtle bg-bg-surface py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-elevated border border-border-subtle">
          <SearchX size={24} className="text-text-muted/50" />
        </div>
        <div>
          <p className="text-base font-semibold text-text-heading">
            No bookings found
          </p>
          <p className="mt-1 text-sm text-text-muted">
            No bookings match the selected filter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-border-subtle bg-bg-surface py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 border border-brand/20">
        <CalendarDays size={28} className="text-brand" />
      </div>
      <div className="max-w-sm">
        <p className="text-lg font-bold text-text-heading">No bookings yet</p>
        <p className="mt-2 text-sm text-text-muted leading-relaxed">
          You haven&apos;t made any bookings yet. Browse our fleet and book your
          first ride!
        </p>
      </div>
      <Link
        href="/vehicles"
        className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground shadow-brand transition-all hover:bg-brand-dark"
      >
        Browse Vehicles
      </Link>
    </div>
  );
}

// ── Error state ───────────────────────────────────────────────────────────────

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-error/20 bg-error/5 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-error/10 border border-error/20">
        <AlertCircle size={24} className="text-error" />
      </div>
      <div>
        <p className="text-base font-semibold text-text-heading">
          Failed to load bookings
        </p>
        <p className="mt-1 text-sm text-text-muted">
          Something went wrong. Please try again.
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-xl border border-error/20 bg-error/10 px-4 py-2 text-sm font-semibold text-error transition-all hover:bg-error/20"
      >
        <RefreshCw size={14} />
        Retry
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function UserBookingsList() {
  const [activeFilter, setActiveFilter] =
    useState<BookingFilterStatus>("all");
  const [selectedBooking, setSelectedBooking] =
    useState<BookingDetailResponse | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [payingId, setPayingId] = useState<number | null>(null);

  const { data: bookings, isLoading, isError, refetch } = useFetchMyBookings();
  const { mutate: cancelBooking } = useCancelMyBooking();
  const { mutate: payNow, isPending: isPayingNow } = useBookingCheckout();

  // ── Computed stats ─────────────────────────────────────────────────────────

  const all = bookings ?? [];

  const counts: Partial<Record<BookingFilterStatus, number>> = {
    all: all.length,
    pending: all.filter((b) => b.status === "pending").length,
    approved: all.filter((b) => b.status === "approved").length,
    confirmed: all.filter((b) => b.status === "confirmed").length,
    completed: all.filter((b) => b.status === "completed").length,
    cancelled: all.filter((b) => b.status === "cancelled").length,
  };

  const filtered =
    activeFilter === "all"
      ? all
      : all.filter((b) => b.status === (activeFilter as BookingStatus));

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleViewDetail = (booking: BookingDetailResponse) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Keep selected booking briefly so exit animation is smooth
    setTimeout(() => setSelectedBooking(null), 200);
  };

  const handleCancel = (id: number) => {
    setCancellingId(id);
    cancelBooking(id, {
      onSuccess: () => {
        setCancellingId(null);
        // Refresh modal booking if it's the same one
        if (selectedBooking?.id === id) {
          handleCloseModal();
        }
      },
      onError: () => {
        setCancellingId(null);
      },
    });
  };

  const handlePayNow = (bookingId: number) => {
    setPayingId(bookingId);
    payNow(bookingId, {
      onError: () => setPayingId(null),
      // onSuccess navigates away via window.location so no cleanup needed
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-9 w-48 rounded-xl bg-skeleton animate-pulse" />
        <UserBookingsSkeleton count={3} />
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const activeCount = (counts.pending ?? 0) + (counts.approved ?? 0) + (counts.confirmed ?? 0);

  return (
    <>
      <div className="space-y-6">
        {/* Stats overview row */}
        {all.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <StatCard label="Total" value={all.length} color="text-text-heading" />
            {activeCount > 0 && (
              <StatCard label="Active" value={activeCount} color="text-brand" />
            )}
            {(counts.completed ?? 0) > 0 && (
              <StatCard label="Completed" value={counts.completed!} color="text-success" />
            )}
            {(counts.cancelled ?? 0) > 0 && (
              <StatCard label="Cancelled" value={counts.cancelled!} color="text-error" />
            )}
          </div>
        )}

        {/* Filter bar */}
        {all.length > 0 && (
          <UserBookingsFilterBar
            activeFilter={activeFilter}
            counts={counts}
            onFilterChange={setActiveFilter}
          />
        )}

        {/* Grid or empty state */}
        {all.length === 0 ? (
          <EmptyState filtered={false} />
        ) : filtered.length === 0 ? (
          <EmptyState filtered />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((booking) => (
              <UserBookingCard
                key={booking.id}
                booking={booking}
                onViewDetail={handleViewDetail}
                onCancel={handleCancel}
                onPayNow={handlePayNow}
                isCancelling={cancellingId === booking.id}
                isPayingNow={isPayingNow && payingId === booking.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      <UserBookingDetailModal
        open={modalOpen}
        booking={selectedBooking}
        isCancelling={cancellingId === selectedBooking?.id}
        isPayingNow={isPayingNow && payingId === selectedBooking?.id}
        onCancel={handleCancel}
        onPayNow={handlePayNow}
        onClose={handleCloseModal}
      />
    </>
  );
}
