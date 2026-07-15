import { useMutation, useQueryClient } from "@tanstack/react-query";

import { vehicleService } from "@/lib/services/vehicle.service";
import { queryKeys } from "@/lib/react-query";
import { VehicleFormData } from "@/types/vehicle.types";

interface MutationProps {
  mode: "create" | "edit";
  id?: number;
}

export function useVehicleMutation({ mode, id }: MutationProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VehicleFormData) => {
      if (mode === "create") {
        return vehicleService.createVehicle(data);
      }

      return vehicleService.updateVehicle(id!, data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.vehicles.all,
      });

      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.vehicles.detail(id),
        });
      }
    },
  });
}
