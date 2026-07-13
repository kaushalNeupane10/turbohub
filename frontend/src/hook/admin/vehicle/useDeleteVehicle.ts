import { useMutation, useQueryClient } from "@tanstack/react-query";

import { vehicleService } from "@/lib/services/vehicle.service";
import { queryKeys } from "@/lib/react-query";

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => vehicleService.deleteVehicle(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.vehicles.all,
      });
    },
  });
}
