import { useQuery } from "@tanstack/react-query";
import { publicVehicleService } from "@/lib/services/public-vehicle.service";
import { queryKeys } from "@/lib/react-query";

/**
 * Fetches public vehicles excluding the top-rented IDs.
 *
 * Used on the home page to show a normal "Explore All Vehicles" grid below
 * the Top Rented and Featured sections, without duplicating vehicles that
 * already appear above.
 *
 * @param topRentedIds  IDs of vehicles already shown in the Top Rented section.
 * @param enabled       Whether to run the query (usually waits until topRentedIds are available).
 */
export function useOtherVehicles(topRentedIds: number[], enabled = true) {
  const excludeIds = topRentedIds.join(",");

  return useQuery({
    queryKey: [...queryKeys.publicVehicles.all, "others", excludeIds],
    queryFn: () =>
      publicVehicleService.getPublicVehicles({
        limit: 8,
        ordering: "-rating",
        exclude_ids: excludeIds || undefined,
      }),
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
  });
}
