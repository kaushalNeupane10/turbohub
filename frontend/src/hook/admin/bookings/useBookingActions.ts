import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/lib/services/booking.service";
import { queryKeys } from "@/lib/react-query";
import { BookingActionPayload } from "@/types/booking.types";

/**
 * Approve / Decline / Refund / Checkout / Return mutations for the admin
 * booking management view.
 *
 * All mutations invalidate the entire `bookings.ownerAll` namespace on
 * success so all cached pages reflect the new booking status immediately.
 */

// ── Shared invalidation helper ───────────────────────────────────────────────

function useInvalidateBookings() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.bookings.ownerAll });
    queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
  };
}

// ── Approve ──────────────────────────────────────────────────────────────────

export function useApproveBooking() {
  const invalidate = useInvalidateBookings();

  return useMutation({
    mutationFn: ({
      bookingId,
      payload,
    }: {
      bookingId: number;
      payload: BookingActionPayload;
    }) => bookingService.approveBooking(bookingId, payload),
    onSuccess: invalidate,
  });
}

// ── Decline ──────────────────────────────────────────────────────────────────

export function useDeclineBooking() {
  const invalidate = useInvalidateBookings();

  return useMutation({
    mutationFn: ({
      bookingId,
      payload,
    }: {
      bookingId: number;
      payload: BookingActionPayload;
    }) => bookingService.declineBooking(bookingId, payload),
    onSuccess: invalidate,
  });
}

// ── Refund ───────────────────────────────────────────────────────────────────

export function useRefundBooking() {
  const invalidate = useInvalidateBookings();

  return useMutation({
    mutationFn: (bookingId: number) => bookingService.refundBooking(bookingId),
    onSuccess: invalidate,
  });
}

// ── Checkout (Pick-up) ───────────────────────────────────────────────────────

export function useCheckoutBooking() {
  const invalidate = useInvalidateBookings();

  return useMutation({
    mutationFn: ({
      bookingId,
      payload,
    }: {
      bookingId: number;
      payload: BookingActionPayload;
    }) => bookingService.checkoutBooking(bookingId, payload),
    onSuccess: invalidate,
  });
}

// ── Return (Drop-off) ────────────────────────────────────────────────────────

export function useReturnBooking() {
  const invalidate = useInvalidateBookings();

  return useMutation({
    mutationFn: ({
      bookingId,
      payload,
    }: {
      bookingId: number;
      payload: BookingActionPayload;
    }) => bookingService.returnBooking(bookingId, payload),
    onSuccess: invalidate,
  });
}
