from rest_framework import viewsets, permissions
from apps.bookings.models import Booking
from .serializers import BookingSerializer
from apps.common.permissions import IsBookingOwner

class BookingViewSet(viewsets.ModelViewSet):

    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsBookingOwner]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).select_related("vehicle", "user")

    def perform_create(self, serializer):
        booking = serializer.save(user=self.request.user)

        # safer day calculation
        days = max(
            (booking.end_date - booking.start_date).days,
            1
        )

        booking.total_price = (
            days * booking.vehicle.price_per_day
        )

        booking.status = "confirmed"
        booking.save(update_fields=["status", "total_price"])