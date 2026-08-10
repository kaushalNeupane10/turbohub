import { useQuery } from "@tanstack/react-query";
import { publicVehicleService } from "@/lib/services/public-vehicle.service";
import { queryKeys } from "@/lib/react-query";
import { PublicVehicleListParams } from "@/types/vehicle.types";

/**
 * Fetches a paginated, filterable list of public vehicles.
 * Used by the browse/explore page (/vehicles).
 *
 * - placeholderData: keeps previous page data while fetching new pages (UX improvement).
 * - staleTime: 5 minutes
 * - No authentication required.
 */
export function usePublicVehicles(params: PublicVehicleListParams = {}) {
  return useQuery({
    queryKey: queryKeys.publicVehicles.list(params),
    queryFn: () => publicVehicleService.getPublicVehicles(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
}
