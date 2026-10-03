import { useQuery } from "@tanstack/react-query";
import { bookingService } from "@/lib/services/booking.service";
import { queryKeys } from "@/lib/react-query";

/**
 * Fetches the current authenticated user's own bookings with full
 * vehicle / payment detail objects embedded — no extra API calls needed.
 *
 * Stale-while-revalidate: cached data stays visible while a background
 * re-fetch is in progress for a smoother experience.
 */
export function useFetchMyBookings() {
  return useQuery({
    queryKey: queryKeys.bookings.list,
    queryFn: () => bookingService.getMyBookings(),
    placeholderData: (previousData) => previousData,
  });
}
