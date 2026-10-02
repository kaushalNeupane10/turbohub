import { useQuery } from "@tanstack/react-query";
import { vehicleService } from "@/lib/services/vehicle.service";
import { queryKeys } from "@/lib/react-query";
import { VehicleListParams } from "@/types/vehicle.types";

/**
 * Custom hook to fetch a paginated list of vehicles with query caching.
 * Keeps previous page data while fetching new pages (placeholderData) to improve UX.
 * 
 * @param params - Parameters for filtering/pagination (page, limit, search)
 */
export function useFetchVehicles(params: VehicleListParams = {}) {
  return useQuery({
    queryKey: queryKeys.vehicles.list(params),
    queryFn: () => vehicleService.getVehicles(params),
    placeholderData: (previousData) => previousData,
  });
}
