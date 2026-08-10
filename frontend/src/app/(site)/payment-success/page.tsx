import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, CalendarDays } from "lucide-react";
import { SessionNoteClient } from "./SessionNoteClient";

export const metadata = {
  title: "Payment Successful",
};

/**
 * Stripe redirects here after a successful checkout:
 *   /payment-success?session_id={CHECKOUT_SESSION_ID}
 *
 * The booking is confirmed server-side by the Stripe webhook
 * (checkout.session.completed → payment.successful, booking.confirmed), so this
 * page is purely a confirmation surface — it does not mutate state.
 */
export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border/70 bg-bg-surface p-8 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 size={34} />
        </div>

        <h1 className="mt-6 text-2xl font-black text-text-heading">
          Payment successful!
        </h1>
        <p className="mt-3 text-text-muted">
          Thank you for your booking. Your payment has been received and your
          rental is now <span className="font-semibold">confirmed</span>. A
          receipt has been sent to your email.
        </p>

        <Suspense fallback={null}>
          <SessionNoteClient />
        </Suspense>

        <div className="mt-8 space-y-3">
          <Link
            href="/bookings"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 font-medium text-brand-foreground transition hover:bg-brand-dark"
          >
            <CalendarDays size={18} />
            View my bookings
          </Link>
          <Link
            href="/vehicles"
            className="flex w-full items-center justify-center rounded-lg border border-border px-4 py-3 font-medium text-text-body transition hover:bg-bg-elevated"
          >
            Continue browsing
          </Link>
        </div>
      </div>
    </div>
  );
}
