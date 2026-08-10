import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/lib/services/booking.service";
import { queryKeys } from "@/lib/react-query";
import { CreateBookingPayload } from "@/types/booking.types";

/**
 * Creates a booking request for a vehicle.
 *
 * The backend flow is: booking (pending) → owner approves → payment.
 * So this mutation only submits the rental request; payment happens later
 * via useBookingCheckout once the owner approves.
 *
 * Invalidates the user's booking list on success.
 */
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) =>
      bookingService.createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
}
