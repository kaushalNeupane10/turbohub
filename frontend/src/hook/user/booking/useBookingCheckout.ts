import { useMutation } from "@tanstack/react-query";
import { paymentService } from "@/lib/services/payment.service";

/**
 * Drives the Stripe checkout path for an approved booking:
 *   1. Create a Payment record for the booking (server validates it's approved).
 *   2. Request a hosted Stripe Checkout session URL.
 *   3. Redirect the browser to Stripe.
 *
 * The caller is responsible for only invoking this on an approved booking.
 * On success the browser navigates away, so there is no onSuccess UI to render.
 */
export function useBookingCheckout() {
  return useMutation({
    mutationFn: async (bookingId: number) => {
      const payment = await paymentService.createPayment(bookingId);
      const { checkout_url } = await paymentService.createCheckoutSession(
        payment.id,
      );
      return checkout_url;
    },
    onSuccess: (checkoutUrl) => {
      // Redirect to Stripe's hosted checkout page.
      window.location.assign(checkoutUrl);
    },
  });
}
