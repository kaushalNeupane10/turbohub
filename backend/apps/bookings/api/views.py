from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.pagination import PageNumberPagination

from apps.bookings.models import Booking
from .serializers import BookingSerializer, BookingDetailSerializer
from .permissions import IsBookingOwner


# ─── Custom paginator for owner booking dashboard ─────────────────────────────

class BookingPageNumberPagination(PageNumberPagination):
    """
    Fixed-page-size paginator used only for the owner bookings dashboard.
    Frontend controls the page via ?page=N; page_size is fixed at 4 for now.
    """
    page_size = 4
    page_size_query_param = "page_size"
    max_page_size = 50

    def get_paginated_response(self, data):
        return Response({
            "count": self.page.paginator.count,
            "page": self.page.number,
            "page_size": self.get_page_size(self.request),
            "total_pages": self.page.paginator.num_pages,
            "results": data,
        })


# ─── Shared queryset helper ───────────────────────────────────────────────────

def _booking_qs():
    """
    Returns the fully-optimised base queryset:
    select_related vehicle, owner, user, and payment to avoid N+1 problems.
    """
    return Booking.objects.select_related(
        "vehicle",
        "vehicle__owner",
        "user",
        "payment",
    ).prefetch_related(
        "vehicle__images",
        "vehicle__images__media",
    )


# ─── ViewSet ──────────────────────────────────────────────────────────────────

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
        if self.action in (
            "list", "retrieve", "owner_bookings",
            "approve_booking", "decline_booking", "cancel_booking", "refund_booking",
        ):
            return BookingDetailSerializer
        return BookingSerializer

    def get_queryset(self):
        user = self.request.user
        qs = _booking_qs()

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
        """
        Returns a paginated list of bookings for vehicles owned by the
        current user, ordered newest-first.
        """
        bookings = _booking_qs().filter(
            vehicle__owner=request.user,
        ).order_by("-created_at")

        paginator = BookingPageNumberPagination()
        page = paginator.paginate_queryset(bookings, request, view=self)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        # Fallback (should not normally be hit)
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)

    # ── Approve booking ───────────────────────────────────────────────

    @action(
        detail=True,
        methods=["patch"],
        url_path="approve",
    )
    def approve_booking(self, request, pk=None):
        """
        Approve a pending booking. Vehicle owner or staff only.
        Accepts an optional 'notes' field in the request body that is
        persisted as owner_notes for the renter to see.
        """
        booking = self.get_object()

        if booking.vehicle.owner != request.user and not request.user.is_staff:
            raise PermissionDenied(
                "Only the vehicle owner can approve bookings."
            )

        if booking.status != "pending":
            raise ValidationError(
                "Only pending bookings can be approved."
            )

        notes = request.data.get("notes", "").strip()

        booking.status = "approved"
        booking.owner_notes = notes
        booking.save(update_fields=["status", "owner_notes", "updated_at"])

        # Re-fetch with all relations for a complete response
        booking.refresh_from_db()
        serializer = self.get_serializer(booking)
        return Response(serializer.data)

    # ── Decline booking (admin / vehicle-owner) ──────────────────────

    @action(
        detail=True,
        methods=["patch"],
        url_path="decline",
    )
    def decline_booking(self, request, pk=None):
        """
        Decline a pending booking. Vehicle owner or staff only.
        Accepts an optional 'notes' field explaining the reason.
        """
        booking = self.get_object()

        if booking.vehicle.owner != request.user and not request.user.is_staff:
            raise PermissionDenied(
                "Only the vehicle owner can decline bookings."
            )

        if booking.status != "pending":
            raise ValidationError(
                "Only pending bookings can be declined."
            )

        notes = request.data.get("notes", "").strip()

        booking.status = "cancelled"
        booking.owner_notes = notes
        booking.save(update_fields=["status", "owner_notes", "updated_at"])

        booking.refresh_from_db()
        serializer = self.get_serializer(booking)
        return Response(serializer.data)

    # ── Refund booking ────────────────────────────────────────────────

    @action(
        detail=True,
        methods=["post"],
        url_path="refund",
    )
    def refund_booking(self, request, pk=None):
        """
        Issue a refund for a booking's payment. Vehicle owner or staff only.
        """
        booking = self.get_object()

        if booking.vehicle.owner != request.user and not request.user.is_staff:
            raise PermissionDenied(
                "Only the vehicle owner can issue refunds."
            )

        if not hasattr(booking, "payment") or not booking.payment:
            raise ValidationError(
                "No payment record found for this booking."
            )

        payment = booking.payment
        if payment.status != "successful":
            raise ValidationError(
                "Only successful payments can be refunded."
            )

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

        booking.refresh_from_db()
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

        booking.refresh_from_db()
        serializer = self.get_serializer(booking)
        return Response(serializer.data)

    # ── Create ────────────────────────────────────────────────────────

    def perform_create(self, serializer):
        """
        All bookings start as 'pending'.
        """
        serializer.save()