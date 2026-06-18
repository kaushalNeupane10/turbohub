from rest_framework import viewsets, permissions
from apps.vehicles.models import Vehicle
from .serializers import VehicleSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.bookings.models import Booking
from rest_framework.exceptions import ValidationError
from .permissions import IsOwnerOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils.dateparse import parse_date


class VehicleViewSet(viewsets.ModelViewSet):

    queryset = Vehicle.objects.select_related("owner").all()

    serializer_class = VehicleSerializer

    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly,
        IsOwnerOrReadOnly
    ]


    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter
    ]


    filterset_fields = [
        "vehicle_type",
        "location",
        "status",
    ]


    search_fields = [
        "name",
        "description",
        "location",
    ]


    ordering_fields = [
        "price_per_day",
        "created_at",
    ]


    ordering = [
        "-created_at"
    ]


    def perform_create(self, serializer):

        serializer.save(
            owner=self.request.user
        )


    @action(
        detail=False,
        methods=["get"],
        permission_classes=[permissions.IsAuthenticated]
    )
    def my_vehicles(self, request):

        vehicles = Vehicle.objects.filter(
            owner=request.user
        )

        serializer = self.get_serializer(
            vehicles,
            many=True
        )

        return Response(serializer.data)



    @action(
        detail=True,
        methods=["get"],
        permission_classes=[permissions.AllowAny]
    )
    def availability(self, request, pk=None):

        vehicle = self.get_object()


        start = request.query_params.get(
            "start_date"
        )

        end = request.query_params.get(
            "end_date"
        )


        if start and end:

            start_date = parse_date(start)

            end_date = parse_date(end)


            if not start_date or not end_date:

                raise ValidationError(
                    "Invalid date format. Use YYYY-MM-DD"
                )


            if start_date >= end_date:

                raise ValidationError(
                    "End date must be after start date"
                )


            conflict = Booking.objects.filter(

                vehicle=vehicle,

                start_date__lt=end_date,

                end_date__gt=start_date,

                status="confirmed"

            ).exists()


            return Response(
                {
                    "available": not conflict
                }
            )


        bookings = Booking.objects.filter(

            vehicle=vehicle,

            status="confirmed"

        ).only(
            "start_date",
            "end_date"
        )


        data = [
            {
                "start_date": booking.start_date,
                "end_date": booking.end_date
            }

            for booking in bookings
        ]


        return Response(data)