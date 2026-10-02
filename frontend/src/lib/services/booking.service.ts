/**
 * BookingService
 *
 * Handles authenticated booking API calls.
 * Flow: create booking (pending) → customer can pay instantly → owner approves or declines → owner can refund if declined.
 */

import { apiClient, API_ENDPOINTS } from "@/lib/api";
import { PaginatedResponse } from "@/types/common/pagination";
import {
  BookingApiResponse,
  BookingActionPayload,
  BookingDetailResponse,
  CreateBookingPayload,
} from "@/types/booking.types";

/** Parameters accepted by the owner bookings paginated endpoint. */
export interface OwnerBookingListParams {
  page?: number;
  page_size?: number;
}

class BookingService {
  /**
   * Creates a booking request for a vehicle.
   * Server always sets status="pending"; customer can pay immediately.
   */
  async createBooking(
    payload: CreateBookingPayload,
  ): Promise<BookingApiResponse> {
    return apiClient<BookingApiResponse>(API_ENDPOINTS.BOOKINGS, {
      method: "POST",
      data: payload,
    });
  }

  /** Fetches the current user's bookings with full vehicle/user/payment details. */
  async getMyBookings(): Promise<BookingDetailResponse[]> {
    return apiClient<BookingDetailResponse[]>(API_ENDPOINTS.BOOKINGS);
  }

  /** Fetches a single booking by id with full details. */
  async getBooking(id: number | string): Promise<BookingDetailResponse> {
    return apiClient<BookingDetailResponse>(
      `${API_ENDPOINTS.BOOKINGS}${id}/`,
    );
  }

  /**
   * Fetches a paginated list of bookings for vehicles owned by the current
   * user (admin / vehicle-owner dashboard).
   */
  async getOwnerBookings(
    params: OwnerBookingListParams = {},
  ): Promise<PaginatedResponse<BookingDetailResponse>> {
    return apiClient<PaginatedResponse<BookingDetailResponse>>(
      `${API_ENDPOINTS.BOOKINGS}owner/`,
      { params },
    );
  }

  /**
   * Approves a pending booking.
   * @param id      Booking ID to approve.
   * @param payload Optional notes explaining the approval.
   */
  async approveBooking(
    id: number,
    payload: BookingActionPayload = {},
  ): Promise<BookingDetailResponse> {
    return apiClient<BookingDetailResponse>(
      `${API_ENDPOINTS.BOOKINGS}${id}/approve/`,
      { method: "PATCH", data: { notes: payload.notes ?? "" } },
    );
  }

  /**
   * Declines a pending booking.
   * @param id      Booking ID to decline.
   * @param payload Optional notes explaining the reason.
   */
  async declineBooking(
    id: number,
    payload: BookingActionPayload = {},
  ): Promise<BookingDetailResponse> {
    return apiClient<BookingDetailResponse>(
      `${API_ENDPOINTS.BOOKINGS}${id}/decline/`,
      { method: "PATCH", data: { notes: payload.notes ?? "" } },
    );
  }

  /**
   * Issues a refund for a booking's payment.
   * @param id Booking ID to refund.
   */
  async refundBooking(id: number): Promise<BookingDetailResponse> {
    return apiClient<BookingDetailResponse>(
      `${API_ENDPOINTS.BOOKINGS}${id}/refund/`,
      { method: "POST" },
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
