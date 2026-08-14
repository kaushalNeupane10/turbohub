from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from apps.reviews.models import Review

from .permissions import IsReviewAuthorOrReadOnly
from .serializers import ReviewSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    """
    CRUD for vehicle reviews.

    - Public list/retrieve, filterable by ?vehicle=<id>.
    - Authenticated users create their own reviews.
    - Authors (or platform admins) can update/delete.

    Vehicle.rating / review_count are kept in sync automatically by the
    reviews app signals whenever a review changes.
    """

    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsReviewAuthorOrReadOnly]

    def get_queryset(self):
        queryset = Review.objects.select_related("user", "vehicle")

        vehicle_id = self.request.query_params.get("vehicle")
        if vehicle_id:
            queryset = queryset.filter(vehicle_id=vehicle_id)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
