/**
 * PublicVehicleService
 *
 * Handles all public-facing vehicle API calls.
 * NO authentication is required for any of these methods.
 *
 * Pattern follows the existing VehicleService in vehicle.service.ts.
 */

import { apiClient, buildUrl, API_ENDPOINTS } from "@/lib/api";
import {
  PublicVehicleApiResponse,
  PublicVehicleListParams,
} from "@/types/vehicle.types";
import { PaginatedResponse } from "@/types/common/pagination";

class PublicVehicleService {
  /**
   * Fetches a paginated list of available vehicles for the public browse page.
   * Supports filtering by vehicle_type, location, search, ordering.
   */
  async getPublicVehicles(
    params: PublicVehicleListParams = {},
  ): Promise<PaginatedResponse<PublicVehicleApiResponse>> {
    return apiClient<PaginatedResponse<PublicVehicleApiResponse>>(
      API_ENDPOINTS.PUBLIC_VEHICLES,
      { params },
    );
  }

  /**
   * Fetches manually curated featured vehicles (is_featured=True).
   * Ordered by rating DESC. Suitable for homepage hero/showcase.
   * Cache aggressively — these change rarely.
   */
  async getFeaturedVehicles(): Promise<
    PaginatedResponse<PublicVehicleApiResponse>
  > {
    return apiClient<PaginatedResponse<PublicVehicleApiResponse>>(
      API_ENDPOINTS.FEATURED_VEHICLES,
    );
  }

  /**
   * Fetches top-rented vehicles this week using the backend scoring algorithm.
   * Algorithm: booking_count × 1.0 + rating × 2.0 + recency_bonus × 1.5
   * Returns up to 8 vehicles ordered by composite score.
   */
  async getTopRentedVehicles(): Promise<PublicVehicleApiResponse[]> {
    // The top-rented endpoint returns a non-paginated list (already limited to 8)
    const response = await apiClient<
      PaginatedResponse<PublicVehicleApiResponse> | PublicVehicleApiResponse[]
    >(API_ENDPOINTS.TOP_RENTED_VEHICLES);

    // Handle both paginated and direct array responses defensively
    if (Array.isArray(response)) {
      return response;
    }
    return (response as PaginatedResponse<PublicVehicleApiResponse>).results ?? [];
  }

  /**
   * Fetches a single vehicle by ID for the detail page.
   */
  async getVehicleDetail(id: number | string): Promise<PublicVehicleApiResponse> {
    return apiClient<PublicVehicleApiResponse>(
      `${API_ENDPOINTS.PUBLIC_VEHICLES}${id}/`,
    );
  }
}

export const publicVehicleService = new PublicVehicleService();
