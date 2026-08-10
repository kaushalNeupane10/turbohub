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

  /** Fetches the current user's bookings. */
  async getMyBookings(): Promise<BookingApiResponse[]> {
    return apiClient<BookingApiResponse[]>(API_ENDPOINTS.BOOKINGS);
  }

  /** Fetches a single booking by id. */
  async getBooking(id: number | string): Promise<BookingApiResponse> {
    return apiClient<BookingApiResponse>(
      `${API_ENDPOINTS.BOOKINGS}${id}/`,
    );
  }
}

export const bookingService = new BookingService();
