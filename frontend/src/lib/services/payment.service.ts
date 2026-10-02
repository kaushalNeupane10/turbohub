/**
 * PaymentService
 *
 * Handles authenticated payment + Stripe checkout calls.
 * Flow: create Payment for an approved booking → request a Stripe Checkout
 * session URL → redirect the browser to Stripe.
 */

import { apiClient, API_ENDPOINTS } from "@/lib/api";
import {
  CheckoutSessionResponse,
  PaymentApiResponse,
} from "@/types/booking.types";

class PaymentService {
  /**
   * Creates a Payment record for an approved booking.
   * Server sets amount = booking.total_price and rejects non-approved bookings.
   */
  async createPayment(bookingId: number): Promise<PaymentApiResponse> {
    return apiClient<PaymentApiResponse>(API_ENDPOINTS.PAYMENTS, {
      method: "POST",
      data: { booking: bookingId },
    });
  }

  /**
   * Requests a Stripe Checkout session for an existing payment.
   * Returns the hosted checkout URL to redirect the browser to.
   */
  async createCheckoutSession(
    paymentId: number,
  ): Promise<CheckoutSessionResponse> {
    return apiClient<CheckoutSessionResponse>(
      `${API_ENDPOINTS.PAYMENTS}${paymentId}/checkout/`,
      { method: "POST" },
    );
  }
}

export const paymentService = new PaymentService();
