/**
 * BookingService
 *
 * Handles authenticated booking API calls.
 * Backend flow: create booking (pending) → owner approves → payment.
 * Pattern mirrors the existing VehicleService.
 */

import { apiClient, API_ENDPOINTS } from "@/lib/api";
import {
  BookingApiResponse,
  BookingDetailResponse,
  CreateBookingPayload,
} from "@/types/booking.types";

class BookingService {
  /**
   * Creates a booking request for a vehicle.
   * Server derives total_price (days × price_per_day) and sets status="pending".
   */
  async createBooking(
    payload: CreateBookingPayload,
  ): Promise<BookingApiResponse> {
    return apiClient<BookingApiResponse>(API_ENDPOINTS.BOOKINGS, {
      method: "POST",
      data: payload,
    });
  }

  /** Fetches the current user's bookings with full vehicle/user details. */
  async getMyBookings(): Promise<BookingDetailResponse[]> {
    return apiClient<BookingDetailResponse[]>(API_ENDPOINTS.BOOKINGS);
  }

  /** Fetches a single booking by id with full details. */
  async getBooking(id: number | string): Promise<BookingDetailResponse> {
    return apiClient<BookingDetailResponse>(
      `${API_ENDPOINTS.BOOKINGS}${id}/`,
    );
  }

  /** Fetches bookings for vehicles owned by the current user (admin/owner). */
  async getOwnerBookings(): Promise<BookingDetailResponse[]> {
    return apiClient<BookingDetailResponse[]>(
      `${API_ENDPOINTS.BOOKINGS}owner/`,
    );
  }

  /** Approves a pending booking (vehicle owner / admin). */
  async approveBooking(id: number): Promise<BookingDetailResponse> {
    return apiClient<BookingDetailResponse>(
      `${API_ENDPOINTS.BOOKINGS}${id}/approve/`,
      { method: "PATCH" },
    );
  }

  /** Declines a pending booking (vehicle owner / admin). */
  async declineBooking(id: number): Promise<BookingDetailResponse> {
    return apiClient<BookingDetailResponse>(
      `${API_ENDPOINTS.BOOKINGS}${id}/decline/`,
      { method: "PATCH" },
    );
  }

  /** Cancels a booking (booking creator or vehicle owner). */
  async cancelBooking(id: number): Promise<BookingDetailResponse> {
    return apiClient<BookingDetailResponse>(
      `${API_ENDPOINTS.BOOKINGS}${id}/cancel/`,
      { method: "PATCH" },
    );
  }
}

export const bookingService = new BookingService();
