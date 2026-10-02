import { useQuery } from "@tanstack/react-query";
import { bookingService, OwnerBookingListParams } from "@/lib/services/booking.service";
import { queryKeys } from "@/lib/react-query";

/**
 * Fetches a paginated list of bookings for vehicles owned by the current
 * authenticated user.  Used by the admin / vehicle-owner bookings dashboard.
 *
 * TanStack Query caches each page independently via the params-based key,
 * so navigating between pages is instant after first load.
 */
export function useFetchOwnerBookings(params: OwnerBookingListParams = {}) {
  return useQuery({
    queryKey: queryKeys.bookings.owner(params),
    queryFn: () => bookingService.getOwnerBookings(params),
    // Keep stale data visible while re-fetching for a smoother UX
    placeholderData: (previousData) => previousData,
  });
}
