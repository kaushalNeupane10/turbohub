import stripe
from django.conf import settings


stripe.api_key = settings.STRIPE_SECRET_KEY

# Resolved once at import time — avoids repeated settings lookups.
_FRONTEND_URL = getattr(settings, "FRONTEND_URL", "http://localhost:3000")


def create_checkout_session(payment):
    """
    Creates a Stripe Checkout Session for the given payment.

    success_url and cancel_url are resolved from FRONTEND_URL so this works
    correctly across dev / staging / production without code changes.
    """
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[
            {
                "price_data": {
                    "currency": payment.currency.lower() or "usd",
                    "product_data": {
                        "name": payment.booking.vehicle.name,
                        "description": (
                            f"Rental: {payment.booking.start_date} → "
                            f"{payment.booking.end_date}"
                        ),
                    },
                    "unit_amount": int(payment.amount * 100),
                },
                "quantity": 1,
            }
        ],
        mode="payment",
        success_url=f"{_FRONTEND_URL}/payment-success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{_FRONTEND_URL}/payment-cancel",
        metadata={
            "payment_id": str(payment.id),
            "booking_id": str(payment.booking.id),
        },
    )
    return session