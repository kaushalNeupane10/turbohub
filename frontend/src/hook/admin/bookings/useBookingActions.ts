import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/lib/services/booking.service";
import { queryKeys } from "@/lib/react-query";
import { BookingActionPayload } from "@/types/booking.types";

/**
 * Approve / Decline / Refund mutations for the admin booking management view.
 *
 * All mutations invalidate the entire `bookings.ownerAll` namespace on
 * success so all cached pages reflect the new booking status immediately.
 */

export function useApproveBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      payload,
    }: {
      bookingId: number;
      payload: BookingActionPayload;
    }) => bookingService.approveBooking(bookingId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.ownerAll });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
}

export function useDeclineBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      payload,
    }: {
      bookingId: number;
      payload: BookingActionPayload;
    }) => bookingService.declineBooking(bookingId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.ownerAll });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
}

export function useRefundBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: number) => bookingService.refundBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.ownerAll });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
}
