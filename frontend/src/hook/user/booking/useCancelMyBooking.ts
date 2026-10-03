import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/lib/services/booking.service";
import { queryKeys } from "@/lib/react-query";

/**
 * Allows the current user to cancel their own booking.
 * Invalidates both the user's booking list and the booking detail cache.
 */
export function useCancelMyBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: number) =>
      bookingService.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
}
