from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError

from apps.bookings.models import Booking
from .serializers import BookingSerializer, BookingDetailSerializer
from .permissions import IsBookingOwner


class BookingViewSet(viewsets.ModelViewSet):

    permission_classes = [
        permissions.IsAuthenticated,
        IsBookingOwner,
    ]

    def get_serializer_class(self):
        """
        Use the rich detail serializer for read operations (list, retrieve,
        and custom actions) and the lean write serializer for create/update.
        """
        if self.action in ("list", "retrieve", "owner_bookings",
                           "approve_booking", "decline_booking",
                           "cancel_booking"):
            return BookingDetailSerializer
        return BookingSerializer

    def get_queryset(self):
        user = self.request.user

        qs = Booking.objects.select_related(
            "vehicle",
            "vehicle__owner",
            "user",
        ).prefetch_related(
            "vehicle__images",
            "vehicle__images__media",
        )

        if user.is_staff:
            return qs.all()

        return qs.filter(user=user)

    # ── Owner bookings (for admin / vehicle-owner dashboard) ──────────

    @action(
        detail=False,
        methods=["get"],
        url_path="owner",
    )
    def owner_bookings(self, request):
        """Returns only bookings for vehicles owned by the current user."""
        bookings = Booking.objects.filter(
            vehicle__owner=request.user,
        ).select_related(
            "vehicle",
            "vehicle__owner",
            "user",
        ).prefetch_related(
            "vehicle__images",
            "vehicle__images__media",
        )

        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)

    # ── Approve booking ───────────────────────────────────────────────

    @action(
        detail=True,
        methods=["patch"],
        url_path="approve",
    )
    def approve_booking(self, request, pk=None):
        booking = self.get_object()

        if booking.vehicle.owner != request.user and not request.user.is_staff:
            raise PermissionDenied(
                "Only the vehicle owner can approve bookings."
            )

        if booking.status != "pending":
            raise ValidationError(
                "Only pending bookings can be approved."
            )

        booking.status = "approved"
        booking.save(update_fields=["status", "updated_at"])

        serializer = self.get_serializer(booking)
        return Response(serializer.data)

    # ── Decline booking (admin / vehicle-owner) ──────────────────────

    @action(
        detail=True,
        methods=["patch"],
        url_path="decline",
    )
    def decline_booking(self, request, pk=None):
        """Vehicle owner or staff declines a pending booking."""
        booking = self.get_object()

        if booking.vehicle.owner != request.user and not request.user.is_staff:
            raise PermissionDenied(
                "Only the vehicle owner can decline bookings."
            )

        if booking.status != "pending":
            raise ValidationError(
                "Only pending bookings can be declined."
            )

        booking.status = "cancelled"
        booking.save(update_fields=["status", "updated_at"])

        serializer = self.get_serializer(booking)
        return Response(serializer.data)

    # ── Cancel booking (user or vehicle-owner) ────────────────────────

    @action(
        detail=True,
        methods=["patch"],
        url_path="cancel",
    )
    def cancel_booking(self, request, pk=None):
        booking = self.get_object()

        if booking.user != request.user and booking.vehicle.owner != request.user:
            raise PermissionDenied(
                "You cannot cancel this booking."
            )

        if booking.status in ["confirmed", "completed"]:
            raise ValidationError(
                "This booking cannot be cancelled."
            )

        booking.status = "cancelled"
        booking.save(update_fields=["status", "updated_at"])

        serializer = self.get_serializer(booking)
        return Response(serializer.data)

    # ── Create ────────────────────────────────────────────────────────

    def perform_create(self, serializer):
        booking = serializer.save()
        if booking.status in ["confirmed", "approved"]:
            from apps.payments.models import Payment
            payment, _ = Payment.objects.get_or_create(
                booking=booking,
                defaults={
                    "user": self.request.user,
                    "amount": booking.total_price,
                },
            )
            booking._instant_payment_id = payment.id