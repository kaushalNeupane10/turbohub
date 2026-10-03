// ─── Booking API types (private, requires auth) ──────────────────────────────
// Mirrors apps/bookings + apps/payments DRF contracts.

export type BookingStatus =
  | "pending"
  | "approved"
  | "confirmed"
  | "cancelled"
  | "completed";

export type PaymentStatus = "pending" | "successful" | "failed" | "refunded";

// ─── Nested payment detail (embedded in BookingDetailResponse) ─────────────

/** Full payment record embedded in booking detail responses. */
export interface BookingPaymentDetail {
  id: number;
  amount: string;
  currency: string;
  status: PaymentStatus;
  payment_method: string;
  transaction_id: string | null;
  stripe_session_id: string | null;
  created_at: string;
}

// ─── Nested vehicle / user detail ────────────────────────────────────────────

/** Lightweight vehicle summary embedded in booking detail responses. */
export interface BookingVehicleDetail {
  id: number;
  name: string;
  vehicle_type: string;
  price_per_day: string;
  location: string;
  cover_image: string | null;
}

/** Lightweight user summary embedded in booking detail responses. */
export interface BookingUserDetail {
  id: number;
  full_name: string;
  email: string;
}

// ─── Core response shapes ─────────────────────────────────────────────────────

/** Shape returned by the lean write serializer (BookingSerializer). */
export interface BookingApiResponse {
  id: number;
  vehicle: number;
  start_date: string; // ISO date (YYYY-MM-DD)
  end_date: string; // ISO date (YYYY-MM-DD)
  total_price: string;
  status: BookingStatus;
  owner_notes: string;
  created_at: string;
  updated_at: string;
}

/**
 * Rich booking response with nested vehicle, user, and payment details.
 * Returned by list, retrieve, approve, decline, and cancel endpoints.
 */
export interface BookingDetailResponse extends BookingApiResponse {
  vehicle_detail: BookingVehicleDetail;
  user_detail: BookingUserDetail;
  /** Full payment record, or null if no payment has been initiated yet. */
  payment_detail: BookingPaymentDetail | null;
}

/** Payload accepted when creating a booking. total_price/status are server-derived. */
export interface CreateBookingPayload {
  vehicle: number;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
}

/** Payload for approve / decline actions (notes are optional). */
export interface BookingActionPayload {
  notes?: string;
}

// ─── Payment API types (private, requires auth) ──────────────────────────────

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

// ─── Public Booking Track Response (No login required) ───────────────────────

export interface PublicBookingTrackResponse {
  id: number;
  start_date: string;
  end_date: string;
  total_price: string;
  status: BookingStatus;
  owner_notes: string;
  customer_name: string;
  payment_status: string | null;
  vehicle_detail: BookingVehicleDetail;
  created_at: string;
  updated_at: string;
}

