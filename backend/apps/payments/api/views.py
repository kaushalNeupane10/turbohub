from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from apps.payments.models import Payment
from apps.bookings.models import Booking

from .serializers import PaymentSerializer



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



    @action(
        detail=True,
        methods=["post"],
        url_path="success"
    )
    def payment_success(self, request, pk=None):

        payment = self.get_object()


        payment.status = "successful"

        payment.transaction_id = (
            request.data.get(
                "transaction_id"
            )
        )


        payment.save(
            update_fields=[
                "status",
                "transaction_id"
            ]
        )


        booking = payment.booking


        booking.status = "confirmed"


        booking.save(
            update_fields=[
                "status"
            ]
        )


        return Response({

            "message":
            "Payment successful. Booking confirmed."

        })