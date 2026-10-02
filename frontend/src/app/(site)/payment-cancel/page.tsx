import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Payment Cancelled",
};

/**
 * Stripe redirects here when the user abandons checkout (cancel_url).
 * No charge is made and the booking stays in its pre-payment state, so the
 * user can retry payment from their bookings whenever they're ready.
 */
export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border/70 bg-bg-surface p-8 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warning/10 text-warning">
          <XCircle size={34} />
        </div>

        <h1 className="mt-6 text-2xl font-black text-text-heading">
          Payment cancelled
        </h1>
        <p className="mt-3 text-text-muted">
          No charge was made. Your booking is still reserved — you can complete
          payment from your bookings whenever you&apos;re ready.
        </p>

        <div className="mt-8 space-y-3">
          <Link
            href="/bookings"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 font-medium text-brand-foreground transition hover:bg-brand-dark"
          >
            Go to my bookings
          </Link>
          <Link
            href="/vehicles"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 font-medium text-text-body transition hover:bg-bg-elevated"
          >
            <ArrowLeft size={18} />
            Continue browsing
          </Link>
        </div>
      </div>
    </div>
  );
}
