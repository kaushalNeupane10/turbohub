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


        payload = request.body

        signature = request.META.get(
            "HTTP_STRIPE_SIGNATURE"
        )


        event = stripe.Webhook.construct_event(

            payload,

            signature,

            settings.STRIPE_WEBHOOK_SECRET

        )


        if event["type"] == "checkout.session.completed":


            session = event["data"]["object"]


            payment_id = session["metadata"]["payment_id"]


            payment = Payment.objects.get(
                id=payment_id
            )


            payment.status = "successful"


            payment.save(
                update_fields=[
                    "status"
                ]
            )


            booking = payment.booking


            booking.status = "confirmed"


            booking.save(
                update_fields=[
                    "status"
                ]
            )


        return Response(
            {"received": True}
        )