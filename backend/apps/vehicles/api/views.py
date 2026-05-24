from rest_framework import viewsets, permissions
from apps.vehicles.models import Vehicle
from .serializers import VehicleSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.bookings.models import Booking
from datetime import datetime
from rest_framework.exceptions import ValidationError
from apps.common.permissions import IsOwnerOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

class VehicleViewSet(viewsets.ModelViewSet):

    queryset = Vehicle.objects.select_related("owner").all()
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    filter_backends = [
    DjangoFilterBackend,
    SearchFilter,
    OrderingFilter
    ]

    #filtering fields
    filterset_fields = [
    "brand",
    "city",
    "fuel_type",
    ]

    # Add search fields
    search_fields = [
    "title",
    "brand",
    "description",
    ]

    #ordering fileds
    ordering_fields = [
    "price_per_day",
    "created_at",
    ]
    ordering = ["-created_at"]

    def perform_create(self, serializer):
        serializer.save(owner = self.request.user)

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def availability(self, request, pk=None):
        vehicle = self.get_object()

        start = request.query_params.get("start_date")
        end = request.query_params.get("end_date")

        #  Validate input
        if start and end:
            try:
                start_date = datetime.strptime(start, "%Y-%m-%d").date()
                end_date = datetime.strptime(end, "%Y-%m-%d").date()
            except ValueError:
                raise ValidationError("Invalid date format. Use YYYY-MM-DD")

            if start_date >= end_date:
                raise ValidationError("End date must be after start date")

            #  Conflict check
            conflict = Booking.objects.filter(
                vehicle=vehicle,
                start_date__lt=end_date,
                end_date__gt=start_date,
                status="confirmed"
            ).exists()

            return Response({
                "available": not conflict
            })

        #  Return all booked slots
        bookings = Booking.objects.filter(
            vehicle=vehicle,
            status="confirmed"
        ).only("start_date", "end_date")  # optimization

        data = [
            {
                "start_date": b.start_date,
                "end_date": b.end_date
            }
            for b in bookings
        ]

        return Response(data)

