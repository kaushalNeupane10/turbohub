import { VehicleListParams } from "@/types/vehicle.types";

export const queryKeys = {
  vehicles: {
    all: ["vehicles"] as const,
    list: (params?: VehicleListParams) => ["vehicles", "list", params] as const,
    detail: (id: string | number) => ["vehicles", "detail", id] as const,
  },
} as const;
