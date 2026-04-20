from rest_framework import viewsets, permissions
from apps.bookings.models import Booking
from .serializers import BookingSerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        booking = serializer.save(user=self.request.user)

        #price calculation
        days = (booking.end_date - booking.start_date).days
        booking.total_price = days * booking.vechile.price_per_day
        booking.status = "confirmed"
        booking.save()