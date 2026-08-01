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
    const data = await apiClient<PaginatedResponse<VehicleApiResponse>>(
      API_ENDPOINTS.VEHICLES,
      {
        params,
      },
    );
    console.log("vehicleData:", data);
    return data;
  }

  async createVehicle(payload: VehicleFormData): Promise<VehicleApiResponse> {
    const { images, ...rest } = payload;
    const apiPayload = {
      ...rest,
      image_ids: images.map(img => img.id)
    };
    return apiClient(API_ENDPOINTS.VEHICLES, {
      method: "POST",
      data: apiPayload,
    });
  }

  async updateVehicle(id: number, payload: VehicleFormData) {
    const { images, ...rest } = payload;
    const apiPayload = {
      ...rest,
      image_ids: images.map(img => img.id)
    };
    return apiClient<VehicleApiResponse>(`${API_ENDPOINTS.VEHICLES}${id}/`, {
      method: "PUT",
      data: apiPayload,
    });
  }

  async deleteVehicle(id: number) {
    return apiClient(`${API_ENDPOINTS.VEHICLES}${id}/`, {
      method: "DELETE",
    });
  }
}

export const vehicleService = new VehicleService();
