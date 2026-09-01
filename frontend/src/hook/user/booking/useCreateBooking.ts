import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/lib/services/booking.service";
import { queryKeys } from "@/lib/react-query";
import { CreateBookingPayload } from "@/types/booking.types";

/**
 * Creates a booking request for a vehicle.
 *
 * For available vehicles, the booking is instantly confirmed and returns
 * a payment_id so the user can immediately complete Stripe payment.
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
