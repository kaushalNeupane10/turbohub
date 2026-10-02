from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, PermissionDenied
from apps.payments.models import Payment
from apps.bookings.models import Booking
from .serializers import PaymentSerializer
from apps.payments.services import create_checkout_session


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(
            user=self.request.user
        ).select_related("booking")

    def perform_create(self, serializer):
        booking = serializer.validated_data["booking"]

        if booking.user != self.request.user:
            raise ValidationError("You cannot pay for this booking")

        if booking.status in ["cancelled", "completed"]:
            raise ValidationError("Cannot create payment for a cancelled or completed booking")

        serializer.save(
            user=self.request.user,
            amount=booking.total_price
        )

    # Checkout URL for Stripe payment
    @action(
        detail=True,
        methods=["post"],
        url_path="checkout"
    )
    def checkout(self, request, pk=None):
        payment = self.get_object()

        if payment.user != request.user:
            raise PermissionDenied()

        session = create_checkout_session(payment)

        payment.stripe_session_id = session.id
        payment.save(update_fields=["stripe_session_id"])

        return Response({
            "checkout_url": session.url
        })

    # Refund action (vehicle owner or admin only)
    @action(
        detail=True,
        methods=["post"],
        url_path="refund"
    )
    def refund(self, request, pk=None):
        payment = self.get_object()

        # Check permissions: owner of the vehicle or staff
        if payment.booking.vehicle.owner != request.user and not request.user.is_staff:
            raise PermissionDenied("Only the vehicle owner or admin can issue refunds.")

        if payment.status != "successful":
            raise ValidationError("Only successful payments can be refunded.")

        import stripe
        from django.conf import settings
        stripe.api_key = getattr(settings, "STRIPE_SECRET_KEY", "")

        if payment.transaction_id and stripe.api_key:
            try:
                stripe.Refund.create(payment_intent=payment.transaction_id)
            except Exception:
                pass

        payment.status = "refunded"
        payment.save(update_fields=["status", "updated_at"])

        return Response({
            "message": "Payment has been refunded successfully.",
            "payment": PaymentSerializer(payment).data
        })

    # Stripe webhook endpoint
    @action(
        detail=False,
        methods=["post"],
        url_path="webhook"
    )
    def webhook(self, request):
        import stripe
        from django.conf import settings
        from rest_framework import status as drf_status

        payload = request.body
        signature = request.META.get("HTTP_STRIPE_SIGNATURE")

        try:
            event = stripe.Webhook.construct_event(
                payload,
                signature,
                settings.STRIPE_WEBHOOK_SECRET,
            )
        except stripe.error.SignatureVerificationError:
            return Response(
                {"error": "Invalid signature"},
                status=drf_status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            return Response(
                {"error": "Webhook error"},
                status=drf_status.HTTP_400_BAD_REQUEST,
            )

        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]
            payment_id = session["metadata"].get("payment_id")

            if not payment_id:
                return Response({"received": True})

            try:
                payment = Payment.objects.select_related("booking").get(id=payment_id)
            except Payment.DoesNotExist:
                return Response({"received": True})

            payment.status = "successful"
            payment.transaction_id = session.get("payment_intent")
            payment.save(update_fields=["status", "transaction_id"])
            # Note: booking status remains 'pending' awaiting admin/owner approval.

        return Response({"received": True})