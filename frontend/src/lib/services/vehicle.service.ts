import { apiClient, API_ENDPOINTS } from "@/lib/api";
import {
  VehicleApiResponse,
  VehicleFormData,
  VehicleListParams,
} from "@/types/vehicle.types";
import { PaginatedResponse } from "@/types/common/pagination";

class VehicleService {
  async getVehicles(
    params: VehicleListParams,
  ): Promise<PaginatedResponse<VehicleApiResponse>> {
    return apiClient<PaginatedResponse<VehicleApiResponse>>(
      API_ENDPOINTS.VEHICLES,
      {
        params,
      },
    );
  }

  async createVehicle(payload: VehicleFormData): Promise<VehicleApiResponse> {
    return apiClient(API_ENDPOINTS.VEHICLES, {
      method: "POST",
      data: payload,
    });
  }

  async updateVehicle(id: number, payload: VehicleFormData) {
    return apiClient<VehicleApiResponse>(`${API_ENDPOINTS.VEHICLES}${id}/`, {
      method: "PUT",
      data: payload,
    });
  }

  async deleteVehicle(id: number) {
    return apiClient(`${API_ENDPOINTS.VEHICLES}${id}/`, {
      method: "DELETE",
    });
  }
}

export const vehicleService = new VehicleService();
