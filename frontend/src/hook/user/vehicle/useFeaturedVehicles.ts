import { useQuery } from "@tanstack/react-query";
import { publicVehicleService } from "@/lib/services/public-vehicle.service";
import { queryKeys } from "@/lib/react-query";

/**
 * Fetches manually curated featured vehicles (is_featured=True).
 *
 * - staleTime: 10 minutes — featured vehicles change infrequently.
 * - gcTime:    30 minutes — keep in cache for session duration.
 * - No authentication required.
 */
export function useFeaturedVehicles() {
  return useQuery({
    queryKey: queryKeys.publicVehicles.featured,
    queryFn: () => publicVehicleService.getFeaturedVehicles(),
    staleTime: 1000 * 60 * 10,   // 10 min
    gcTime: 1000 * 60 * 30,      // 30 min
    select: (data) => data.results,
  });
}
