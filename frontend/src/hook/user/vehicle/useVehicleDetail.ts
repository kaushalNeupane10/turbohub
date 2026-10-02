import { useQuery } from "@tanstack/react-query";
import { publicVehicleService } from "@/lib/services/public-vehicle.service";
import { queryKeys } from "@/lib/react-query";

/**
 * Fetches a single public vehicle by id for the detail page (/vehicles/[id]).
 *
 * - staleTime: 5 minutes.
 * - enabled only when an id is present.
 * - No authentication required.
 */
export function useVehicleDetail(id: string | number | undefined) {
  return useQuery({
    queryKey: queryKeys.publicVehicles.detail(id ?? ""),
    queryFn: () => publicVehicleService.getVehicleDetail(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}
