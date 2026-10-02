"use client";

import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  Ban,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

import BookingFilters from "@/components/admin/bookings/BookingFilters";
import BookingTable from "@/components/admin/bookings/BookingTable";
import BookingTableSkeleton from "@/components/admin/bookings/BookingTableSkeleton";
import BookingEmptyState from "@/components/admin/bookings/BookingEmptyState";
import BookingDetailModal from "@/components/admin/bookings/BookingDetailModal";
import Pagination from "@/components/ui/common/Pagination";

import { useFetchOwnerBookings } from "@/hook/admin/bookings/useFetchOwnerBookings";
import {
  useApproveBooking,
  useDeclineBooking,
  useRefundBooking,
} from "@/hook/admin/bookings/useBookingActions";
import { useDebounce } from "@/hook/common/useDebounce";

import { BookingDetailResponse, BookingStatus } from "@/types/booking.types";
import { PaginationMeta } from "@/types/common/pagination";

const PAGE_SIZE = 4;

// ── Stat card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  count: number;
  icon: React.ElementType;
  colorClass: string;
}

function StatCard({ label, count, icon: Icon, colorClass }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border-subtle bg-bg-surface px-5 py-4 shadow-sm">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colorClass}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-black text-text-heading leading-none">
          {count}
        </p>
        <p className="mt-0.5 text-xs font-medium text-text-muted">{label}</p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BookingsPage() {
  /* ── State ─────────────────────────────────────────────────────────── */
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("");
  const [selectedBooking, setSelectedBooking] =
    useState<BookingDetailResponse | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  /* ── Data ──────────────────────────────────────────────────────────── */
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchOwnerBookings({ page, page_size: PAGE_SIZE });

  const allBookings = response?.results ?? [];

  /* ── Mutations ─────────────────────────────────────────────────────── */
  const approveMutation = useApproveBooking();
  const declineMutation = useDeclineBooking();
  const refundMutation = useRefundBooking();

  /* ── Derived / filtered data ───────────────────────────────────────── */
  const filteredBookings = useMemo(() => {
    return allBookings.filter((b) => {
      const matchesStatus = !statusFilter || b.status === statusFilter;
      const q = debouncedSearch.toLowerCase();
      const matchesSearch =
        !q ||
        b.user_detail?.full_name?.toLowerCase().includes(q) ||
        b.user_detail?.email?.toLowerCase().includes(q) ||
        b.vehicle_detail?.name?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [allBookings, statusFilter, debouncedSearch]);

  /* ── Pagination meta ────────────────────────────────────────────────── */
  const pagination: PaginationMeta | null = response
    ? {
        count: response.count,
        page: response.page,
        pageSize: response.page_size,
        totalPages: response.total_pages,
      }
    : null;

  /* ── Stats (computed from current page results) ─────────────────────── */
  const stats = useMemo(() => {
    const total = response?.count ?? 0;
    const pending = allBookings.filter((b) => b.status === "pending").length;
    const confirmed = allBookings.filter((b) => b.status === "confirmed").length;
    const cancelled = allBookings.filter((b) => b.status === "cancelled").length;
    const approved = allBookings.filter((b) => b.status === "approved").length;
    return { total, pending, confirmed, cancelled, approved };
  }, [allBookings, response]);

  /* ── Handlers ──────────────────────────────────────────────────────── */
  const handleApprove = async (id: number, notes: string) => {
    try {
      const updated = await approveMutation.mutateAsync({
        bookingId: id,
        payload: { notes },
      });
      toast.success("Booking approved.");
      if (selectedBooking?.id === id) {
        setSelectedBooking(updated);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to approve booking.";
      toast.error(msg);
    }
  };

  const handleDecline = async (id: number, notes: string) => {
    try {
      const updated = await declineMutation.mutateAsync({
        bookingId: id,
        payload: { notes },
      });
      toast.success("Booking declined.");
      if (selectedBooking?.id === id) {
        setSelectedBooking(updated);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to decline booking.";
      toast.error(msg);
    }
  };

  const handleRefund = async (id: number) => {
    try {
      const updated = await refundMutation.mutateAsync(id);
      toast.success("Payment refunded successfully.");
      if (selectedBooking?.id === id) {
        setSelectedBooking(updated);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to refund payment.";
      toast.error(msg);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("");
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Reset client-side filters on page change
    setSearch("");
    setStatusFilter("");
  };

  const hasFilters = Boolean(search) || Boolean(statusFilter);

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <section className="container-main py-8 md:py-12 animate-in fade-in duration-300">
      {/* ── Page Header ───────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-heading">
              Booking Management
            </h1>
            <p className="mt-2 text-sm text-text-muted max-w-xl">
              Review and manage rental requests for your vehicles. Approve or
              decline pending bookings and cross-verify payment details.
            </p>
          </div>

          {/* Pending alert badge */}
          {!isLoading && stats.pending > 0 && (
            <div className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-warning/25 bg-warning/8 px-4 py-2.5 text-sm font-semibold text-warning">
              <AlertTriangle size={16} />
              {stats.pending} pending
              {stats.pending === 1 ? " request" : " requests"}
            </div>
          )}
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────────────────────────────── */}
      {!isLoading && !isError && (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Total Bookings"
            count={stats.total}
            icon={CalendarCheck}
            colorClass="bg-brand/10 text-brand"
          />
          <StatCard
            label="Pending"
            count={stats.pending}
            icon={Clock}
            colorClass="bg-warning/10 text-warning"
          />
          <StatCard
            label="Confirmed"
            count={stats.confirmed}
            icon={ShieldCheck}
            colorClass="bg-success/10 text-success"
          />
          <StatCard
            label="Cancelled"
            count={stats.cancelled}
            icon={Ban}
            colorClass="bg-error/10 text-error"
          />
        </div>
      )}

      {/* ── Main Content Card ──────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-3xl border border-border-subtle bg-bg-surface shadow-md">
        {/* Filters */}
        <BookingFilters
          search={search}
          status={statusFilter}
          hasFilters={hasFilters}
          onSearchChange={(v) => setSearch(v)}
          onStatusChange={(v) => setStatusFilter(v)}
          onClearFilters={handleClearFilters}
        />

        {/* Loading skeleton */}
        {isLoading && <BookingTableSkeleton />}

        {/* Error state */}
        {isError && (
          <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
            <AlertTriangle size={36} className="text-error/70" strokeWidth={1.5} />
            <p className="text-base font-semibold text-text-heading">
              Failed to load bookings
            </p>
            <p className="text-sm text-text-muted">
              {(error as Error)?.message ?? "Something went wrong."}
            </p>
            <button
              onClick={() => setPage(1)}
              className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-brand hover:bg-brand-dark transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && filteredBookings.length === 0 && (
          <BookingEmptyState
            hasFilters={hasFilters}
            onClearFilters={handleClearFilters}
          />
        )}

        {/* Table */}
        {!isLoading && !isError && filteredBookings.length > 0 && (
          <BookingTable
            bookings={filteredBookings}
            approvingId={
              approveMutation.isPending
                ? (approveMutation.variables as { bookingId: number })?.bookingId
                : null
            }
            decliningId={
              declineMutation.isPending
                ? (declineMutation.variables as { bookingId: number })?.bookingId
                : null
            }
            refundingId={
              refundMutation.isPending
                ? (refundMutation.variables as number)
                : null
            }
            onView={(b) => setSelectedBooking(b)}
            onApprove={handleApprove}
            onDecline={handleDecline}
            onRefund={handleRefund}
          />
        )}

        {/* Pagination */}
        {!isLoading && !isError && pagination && (
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        )}
      </div>

      {/* ── Detail Modal ───────────────────────────────────────────────── */}
      <BookingDetailModal
        open={Boolean(selectedBooking)}
        booking={selectedBooking}
        isApproving={
          approveMutation.isPending &&
          (approveMutation.variables as { bookingId: number })?.bookingId ===
            selectedBooking?.id
        }
        isDeclining={
          declineMutation.isPending &&
          (declineMutation.variables as { bookingId: number })?.bookingId ===
            selectedBooking?.id
        }
        isRefunding={
          refundMutation.isPending &&
          (refundMutation.variables as number) === selectedBooking?.id
        }
        onApprove={handleApprove}
        onDecline={handleDecline}
        onRefund={handleRefund}
        onClose={() => setSelectedBooking(null)}
      />
    </section>
  );
}
