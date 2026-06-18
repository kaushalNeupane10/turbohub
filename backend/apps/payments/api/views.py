from rest_framework import viewsets, permissions
from apps.payments.models import Payment
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


        payment = serializer.save(
            user=self.request.user,
            amount=booking.total_price
        )


        return payment