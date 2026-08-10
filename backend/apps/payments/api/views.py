from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from apps.payments.models import Payment
from apps.bookings.models import Booking
from .serializers import PaymentSerializer
from apps.payments.services import create_checkout_session
from rest_framework.exceptions import PermissionDenied

class PaymentViewSet(viewsets.ModelViewSet):


    serializer_class = PaymentSerializer


    permission_classes = [
        permissions.IsAuthenticated
    ]



    def get_queryset(self):

        return Payment.objects.filter(
            user=self.request.user
        ).select_related(
            "booking"
        )



    def perform_create(self, serializer):

        booking = serializer.validated_data["booking"]


        if booking.user != self.request.user:

            raise ValidationError(
                "You cannot pay for this booking"
            )


        if booking.status != "approved":

            raise ValidationError(
                "Booking must be approved before payment"
            )


        serializer.save(

            user=self.request.user,

            amount=booking.total_price

        )

    
    # checkout url for payment stripe
    @action(
    detail=True,
    methods=["post"],
    url_path="checkout"
    )
    def checkout(self, request, pk=None):

        payment = self.get_object()


        if payment.user != request.user:

            raise PermissionDenied()


        session = create_checkout_session(
            payment
        )


        payment.stripe_session_id = session.id

        payment.save(
            update_fields=[
                "stripe_session_id"
            ]
        )


        return Response({

            "checkout_url":
            session.url

        })

    # stripe webhook endpoint
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

        signature = request.META.get(
            "HTTP_STRIPE_SIGNATURE"
        )

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
                payment = Payment.objects.select_related("booking").get(
                    id=payment_id
                )
            except Payment.DoesNotExist:
                return Response({"received": True})


            payment.status = "successful"
            payment.transaction_id = session.get("payment_intent")
            payment.save(
                update_fields=["status", "transaction_id"]
            )


            booking = payment.booking
            booking.status = "confirmed"
            booking.save(
                update_fields=["status"]
            )


        return Response(
            {"received": True}
        )