import { useQuery } from "@tanstack/react-query";
import { bookingService } from "@/lib/services/booking.service";
import { queryKeys } from "@/lib/react-query";

/**
 * Publicly tracks a booking by ID without requiring authentication.
 * Enabled only when a valid non-empty bookingId is provided.
 */
export function useTrackBooking(bookingId: string | null) {
  const cleanId = bookingId?.trim() ?? "";

  return useQuery({
    queryKey: queryKeys.bookings.track(cleanId),
    queryFn: () => bookingService.trackBooking(cleanId),
    enabled: Boolean(cleanId),
    retry: 1,
    staleTime: 1000 * 30, // 30 seconds fresh
  });
}
