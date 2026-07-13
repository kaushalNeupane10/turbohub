import { useMutation, useQueryClient } from "@tanstack/react-query";

import { vehicleService } from "@/lib/services/vehicle.service";
import { queryKeys } from "@/lib/react-query";
import { VehicleFormData } from "@/types/vehicle.types";

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VehicleFormData) => vehicleService.createVehicle(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.vehicles.all,
      });
    },
  });
}
