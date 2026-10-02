import { useMutation, useQueryClient } from "@tanstack/react-query";

import { vehicleService } from "@/lib/services/vehicle.service";
import { queryKeys } from "@/lib/react-query";
import { VehicleFormData } from "@/types/vehicle.types";

interface UpdateVehiclePayload {
  id: number;
  data: VehicleFormData;
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateVehiclePayload) =>
      vehicleService.updateVehicle(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.vehicles.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.vehicles.detail(variables.id),
      });
    },
  });
}
