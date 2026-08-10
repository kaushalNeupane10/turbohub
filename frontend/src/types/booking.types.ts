// ─── Booking API types (private, requires auth) ──────────────────────────────
// Mirrors apps/bookings + apps/payments DRF contracts.

export type BookingStatus =
  | "pending"
  | "approved"
  | "confirmed"
  | "cancelled"
  | "completed";

/** Shape returned by the bookings API (BookingSerializer, fields="__all__"). */
export interface BookingApiResponse {
  id: number;
  vehicle: number;
  start_date: string; // ISO date (YYYY-MM-DD)
  end_date: string; // ISO date (YYYY-MM-DD)
  total_price: string;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

/** Payload accepted when creating a booking. total_price/status are server-derived. */
export interface CreateBookingPayload {
  vehicle: number;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
}

// ─── Payment API types (private, requires auth) ──────────────────────────────

export type PaymentStatus = "pending" | "successful" | "failed" | "refunded";

/** Shape returned by the payments API (PaymentSerializer, fields="__all__"). */
export interface PaymentApiResponse {
  id: number;
  booking: number;
  amount: string;
  currency: string;
  transaction_id: string | null;
  payment_method: string;
  status: PaymentStatus;
  stripe_session_id: string | null;
  created_at: string;
  updated_at: string;
}

/** Response from the Stripe checkout action (POST /payments/{id}/checkout/). */
export interface CheckoutSessionResponse {
  checkout_url: string;
}
