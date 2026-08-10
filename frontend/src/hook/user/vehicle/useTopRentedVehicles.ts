import { useQuery } from "@tanstack/react-query";
import { publicVehicleService } from "@/lib/services/public-vehicle.service";
import { queryKeys } from "@/lib/react-query";

/**
 * Fetches top-rented vehicles this week using the backend scoring algorithm.
 *
 * Algorithm weights (tunable in Django settings):
 *   score = booking_count × 1.0 + rating × 2.0 + recency_bonus × 1.5
 *
 * - staleTime: 5 minutes — rankings update throughout the week.
 * - gcTime:    15 minutes
 * - No authentication required.
 */
export function useTopRentedVehicles() {
  return useQuery({
    queryKey: queryKeys.publicVehicles.topRented,
    queryFn: () => publicVehicleService.getTopRentedVehicles(),
    staleTime: 1000 * 60 * 5,    // 5 min
    gcTime: 1000 * 60 * 15,      // 15 min
  });
}
