"""
Public-facing (read-only) vehicle serializer.

Deliberately excludes:
  - owner / owner_id  (private)
  - image_ids write field (not needed publicly)

Includes annotated fields injected by the view queryset:
  - booking_count_this_week  (populated by TopRentedVehicleListView)
"""

from rest_framework import serializers
from apps.vehicles.models import Vehicle


class PublicVehicleImageSerializer(serializers.Serializer):
    """Lightweight nested image representation for public API."""
    id = serializers.UUIDField()
    url = serializers.CharField()
    order = serializers.IntegerField()
    is_cover = serializers.BooleanField()


class PublicVehicleSerializer(serializers.ModelSerializer):
    """
    Read-only serializer for the public-facing vehicle showcase endpoints.
    No authentication required to consume this serializer.
    """

    images = serializers.SerializerMethodField()

    # This field is only populated on queryset annotated by PublicVehicleViewSet.top_rented
    booking_count_this_week = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = [
            "id",
            "name",
            "description",
            "vehicle_type",
            "badge",
            "tagline",
            "price_per_day",
            "location",
            "status",
            "rating",
            "review_count",
            "is_featured",
            "images",
            "booking_count_this_week",
            "created_at",
        ]
        read_only_fields = fields  # everything is read-only in the public API

    def get_images(self, obj):
        """
        Iterate over the prefetched images queryset.
        Returns an empty list if no images have been attached.
        """
        return [
            {
                "id": str(vi.media.id),
                "url": vi.media.secure_url,
                "order": vi.order,
                "is_cover": vi.is_cover,
            }
            for vi in obj.images.all()
            if hasattr(vi, "media") and vi.media
        ]

    def get_booking_count_this_week(self, obj):
        """
        Returns the annotated booking count if present on the queryset object,
        otherwise returns None so non-annotated endpoints don't expose 0 misleadingly.
        """
        return getattr(obj, "booking_count_this_week", None)
