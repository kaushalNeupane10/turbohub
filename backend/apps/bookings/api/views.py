from rest_framework import viewsets, permissions
from apps.bookings.models import Booking
from .serializers import BookingSerializer
from .permissions import IsBookingOwner
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError


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

# returns only bookings for owner's vehicles.
    @action(
    detail=False,
    methods=["get"],
    url_path="owner"
    )
    def owner_bookings(self, request):

        bookings = Booking.objects.filter(
            vehicle__owner=request.user
        ).select_related(
            "vehicle",
            "user"
        )

        serializer = self.get_serializer(
            bookings,
            many=True
        )

        return Response(serializer.data)

# Add approve action
    @action(
    detail=True,
    methods=["patch"],
    url_path="approve"
    )
    def approve_booking(self, request, pk=None):

        booking = self.get_object()


        if booking.vehicle.owner != request.user:

            raise PermissionDenied(
                "Only vehicle owner can approve booking"
            )


        if booking.status != "pending":

            raise ValidationError(
                "Only pending bookings can be approved"
            )


        booking.status = "approved"

        booking.save(
            update_fields=["status"]
        )


        return Response({
            "message": "Booking approved"
        })

# Add cancel action
    @action(
    detail=True,
    methods=["patch"],
    url_path="cancel"
    )
    def cancel_booking(self, request, pk=None):

        booking = self.get_object()


        if booking.user != request.user and booking.vehicle.owner != request.user:

            raise PermissionDenied(
                "You cannot cancel this booking"
            )


        if booking.status in [
            "confirmed",
            "completed"
        ]:

            raise ValidationError(
                "This booking cannot be cancelled"
            )


        booking.status = "cancelled"

        booking.save(
            update_fields=["status"]
        )


        return Response({
            "message": "Booking cancelled"
        })



    def perform_create(self, serializer):

        serializer.save(
            user=self.request.user
        )