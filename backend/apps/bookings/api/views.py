from rest_framework import viewsets, permissions
from apps.bookings.models import Booking
from .serializers import BookingSerializer
from .permissions import IsBookingOwner



class BookingViewSet(viewsets.ModelViewSet):

    serializer_class = BookingSerializer

    permission_classes = [
        permissions.IsAuthenticated,
        IsBookingOwner
    ]



    def get_queryset(self):

        user = self.request.user


        if user.is_staff:

            return Booking.objects.select_related(
                "vehicle",
                "user"
            ).all()


        return Booking.objects.filter(
            user=user
        ).select_related(
            "vehicle",
            "user"
        )



    def perform_create(self, serializer):

        serializer.save(
            user=self.request.user
        )