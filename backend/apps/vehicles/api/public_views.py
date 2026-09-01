"""
Public vehicle API views — read-only, no authentication required.

URL namespace: api/vehicles/public/

Endpoints:
  GET  /api/vehicles/public/              — paginated list with filtering
  GET  /api/vehicles/public/{id}/         — single vehicle detail
  GET  /api/vehicles/public/featured/     — manually curated featured vehicles
  GET  /api/vehicles/public/top-rented/   — algorithm-ranked vehicles (this week)

Top-Rented Algorithm
---------------------
Computes a composite score per vehicle using confirmed bookings in the last 7 days:

  score = (booking_count_this_week × WEIGHT_BOOKINGS)
        + (rating × WEIGHT_RATING)
        + (1 / (1 + days_since_last_booking) × WEIGHT_RECENCY)

Weights can be tuned via Django settings (defaults provided below).
Only vehicles with status="available" are ranked.
"""

from __future__ import annotations

import math
from datetime import timedelta

from django.conf import settings
from django.db.models import (
    Case,
    Count,
    DecimalField,
    ExpressionWrapper,
    F,
    FloatField,
    OuterRef,
    Q,
    Subquery,
    Value,
    When,
)
from django.db.models.functions import Cast, Coalesce, ExtractDay, Now
from django.utils import timezone

from apps.bookings.models import Booking
from apps.common.pagination import TurboHubPagination
from apps.vehicles.models import Vehicle
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet

from .public_serializers import PublicVehicleSerializer

# ─── Algorithm weights ────────────────────────────────────────────────────────
# Override in settings.py if you want to tune ranking without a code deploy.
WEIGHT_BOOKINGS: float = getattr(settings, "TOP_RENTED_WEIGHT_BOOKINGS", 1.0)
WEIGHT_RATING: float = getattr(settings, "TOP_RENTED_WEIGHT_RATING", 2.5)
WEIGHT_RECENCY: float = getattr(settings, "TOP_RENTED_WEIGHT_RECENCY", 1.5)
TOP_RENTED_LIMIT: int = getattr(settings, "TOP_RENTED_LIMIT", 8)
TOP_RENTED_WINDOW_DAYS: int = getattr(settings, "TOP_RENTED_WINDOW_DAYS", 7)


class PublicVehicleViewSet(ReadOnlyModelViewSet):
    """
    Read-only viewset for the public vehicle showcase.

    All endpoints are open to anonymous users (AllowAny).
    Authentication is NOT required.
    """

    serializer_class = PublicVehicleSerializer
    pagination_class = TurboHubPagination
    permission_classes = [permissions.AllowAny]

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["vehicle_type", "location", "status"]
    search_fields = ["name", "description", "location"]
    ordering_fields = ["price_per_day", "rating", "review_count", "created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        """
        Base queryset for the public API:
          - Only available vehicles
          - Optimised with select_related / prefetch_related to avoid N+1
          - Supports ?exclude_ids=1,2,3 to omit specific vehicle IDs (used by
            the home page to avoid showing top-rented vehicles in the "all" grid)
        """
        qs = (
            Vehicle.objects.filter(status="available")
            .select_related("owner")
            .prefetch_related("images__media")
        )

        exclude_ids_raw = self.request.query_params.get("exclude_ids", "")
        if exclude_ids_raw:
            try:
                exclude_ids = [
                    int(x.strip()) for x in exclude_ids_raw.split(",") if x.strip()
                ]
                if exclude_ids:
                    qs = qs.exclude(pk__in=exclude_ids)
            except (ValueError, TypeError):
                pass  # silently ignore malformed exclude_ids

        return qs

    # ─── Extra actions ─────────────────────────────────────────────────────

    @action(
        detail=False,
        methods=["get"],
        url_path="featured",
        permission_classes=[permissions.AllowAny],
    )
    def featured(self, request):
        """
        Returns manually curated featured vehicles (is_featured=True),
        ordered by rating descending.

        Cache hint: these change rarely — safe to cache for 10 minutes.
        """
        queryset = (
            Vehicle.objects.filter(status="available", is_featured=True)
            .prefetch_related("images__media")
            .order_by("-rating", "-review_count")
        )

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["get"],
        url_path="top-rented",
        permission_classes=[permissions.AllowAny],
    )
    def top_rented(self, request):
        """
        Returns the top-rented vehicles this week, ranked by a composite score.

        Algorithm
        ---------
        window_start = now() - TOP_RENTED_WINDOW_DAYS

        For each available vehicle:
          1. booking_count  = COUNT of confirmed bookings within the window
          2. rating_score   = vehicle.rating (stored decimal, 0–5)
          3. recency_bonus  = 1 / (1 + days_since_last_booking_in_window)
                              where days_since_last_booking uses the most recent
                              booking start_date within the window.
                              Vehicles with no recent booking get bonus = 0.

          composite_score = (booking_count × WEIGHT_BOOKINGS)
                          + (rating_score  × WEIGHT_RATING)
                          + (recency_bonus × WEIGHT_RECENCY)

        Returns TOP_RENTED_LIMIT results ordered by composite_score DESC.

        Cache hint: rankings change throughout the week — cache for 5 minutes.
        """
        window_start = timezone.now() - timedelta(days=TOP_RENTED_WINDOW_DAYS)

        # ── 1. Subquery: count of confirmed bookings within the window ──
        bookings_in_window = (
            Booking.objects.filter(
                vehicle=OuterRef("pk"),
                status="confirmed",
                start_date__gte=window_start.date(),
            )
            .values("vehicle")
            .annotate(cnt=Count("id"))
            .values("cnt")
        )

        # ── 2. Subquery: most recent booking start_date within window ──
        latest_booking_date = (
            Booking.objects.filter(
                vehicle=OuterRef("pk"),
                status="confirmed",
                start_date__gte=window_start.date(),
            )
            .order_by("-start_date")
            .values("start_date")[:1]
        )

        queryset = (
            Vehicle.objects.filter(status="available")
            .prefetch_related("images__media")
            .annotate(
                # booking count (0 if no bookings this week)
                booking_count_this_week=Coalesce(
                    Subquery(bookings_in_window, output_field=FloatField()),
                    Value(0.0, output_field=FloatField()),
                ),
                # days since most recent booking (None → 9999 so recency_bonus ≈ 0)
                _last_booking_date=Subquery(
                    latest_booking_date,
                ),
            )
        )

        # ── 3. Compute composite score in Python (SQLite-safe) ──
        #
        # Django's ORM annotation of arbitrary float math across Subquery is
        # SQLite-fragile with DecimalField casts.  We fetch the annotated rows
        # and score them in Python — the dataset is small (all available vehicles)
        # and this avoids DB-engine differences between dev (SQLite) and prod (Postgres).

        today = timezone.now().date()

        def _score(vehicle) -> float:
            cnt = vehicle.booking_count_this_week or 0.0
            rating = float(vehicle.rating or 0)
            last_date = vehicle._last_booking_date

            if last_date:
                days_ago = max(0, (today - last_date).days)
                recency = 1.0 / (1.0 + days_ago)
            else:
                recency = 0.0

            return (
                cnt * WEIGHT_BOOKINGS
                + rating * WEIGHT_RATING
                + recency * WEIGHT_RECENCY
            )

        # Evaluate queryset once, score and sort in Python.
        # Minimum threshold: only rank vehicles that have at least 1 booking
        # this week OR a rating >= 3.0 — prevents unbooked/unrated vehicles
        # from appearing in "Top Rented".
        MIN_RATING = getattr(settings, "TOP_RENTED_MIN_RATING", 3.0)
        MIN_BOOKINGS = getattr(settings, "TOP_RENTED_MIN_BOOKINGS", 1)

        vehicles = list(queryset)
        qualified = [
            v for v in vehicles
            if (v.booking_count_this_week or 0) >= MIN_BOOKINGS
            or float(v.rating or 0) >= MIN_RATING
        ]
        qualified.sort(key=_score, reverse=True)
        top_vehicles = qualified[:TOP_RENTED_LIMIT]

        serializer = self.get_serializer(top_vehicles, many=True)
        return Response(serializer.data)
