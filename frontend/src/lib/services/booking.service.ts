/**
 * BookingService
 *
 * Handles authenticated booking API calls.
 * Flow: create booking (pending) → customer can pay instantly → owner approves or declines → owner can refund if declined.
 */

import { apiClient, publicApiClient, API_ENDPOINTS } from "@/lib/api";
import { PaginatedResponse } from "@/types/common/pagination";
import {
  BookingApiResponse,
  BookingActionPayload,
  BookingDetailResponse,
  CreateBookingPayload,
  PublicBookingTrackResponse,
} from "@/types/booking.types";

/** Parameters accepted by the owner bookings paginated endpoint. */
export interface OwnerBookingListParams {
  page?: number;
  page_size?: number;
  /** Filter by booking status (server-side). */
  status?: string;
  /** Filter by vehicle type (server-side). */
  vehicle_type?: string;
  /** Full-text search on renter name, email or vehicle name (server-side). */
  search?: string;
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

  /**
   * Checks out a vehicle (marks as picked up by customer).
   * Transitions status from 'approved' to 'confirmed'.
   */
  async checkoutBooking(
    id: number,
    payload: BookingActionPayload = {},
  ): Promise<BookingDetailResponse> {
    return apiClient<BookingDetailResponse>(
      `${API_ENDPOINTS.BOOKINGS}${id}/checkout/`,
      { method: "PATCH", data: { notes: payload.notes ?? "" } },
    );
  }

  /**
   * Checks in a returned vehicle (marks as dropped off by customer).
   * Transitions status from 'confirmed' to 'completed'.
   */
  async returnBooking(
    id: number,
    payload: BookingActionPayload = {},
  ): Promise<BookingDetailResponse> {
    return apiClient<BookingDetailResponse>(
      `${API_ENDPOINTS.BOOKINGS}${id}/return/`,
      { method: "PATCH", data: { notes: payload.notes ?? "" } },
    );
  }

  /** Cancels a booking (booking creator or vehicle owner). */
  async cancelBooking(id: number): Promise<BookingDetailResponse> {
    return apiClient<BookingDetailResponse>(
      `${API_ENDPOINTS.BOOKINGS}${id}/cancel/`,
      { method: "PATCH" },
    );
  }

  /**
   * Tracks a booking by Booking ID without requiring authentication.
   * Accepts ID string (e.g. "15", "#15", "TB-15") or number.
   * Uses publicApiClient — no cookies sent, no auth-refresh loop triggered.
   */
  async trackBooking(
    id: string | number,
  ): Promise<PublicBookingTrackResponse> {
    const cleanId = String(id)
      .trim()
      .replace(/^#/, "")
      .replace(/^TB-/i, "")
      .replace(/^TB/i, "")
      .trim();

    return publicApiClient<PublicBookingTrackResponse>(
      `${API_ENDPOINTS.BOOKINGS}track/`,
      { params: { id: cleanId } },
    );
  }
}

export const bookingService = new BookingService();
