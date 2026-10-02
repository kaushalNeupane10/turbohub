from rest_framework import serializers
from apps.vehicles.models import Vehicle, VehicleImage
from media_manager.models import MediaFile
from django.db import transaction


class VehicleSerializer(serializers.ModelSerializer):
    # Frontend sends these UUIDs when creating/updating
    image_ids = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True,
        required=False,
        allow_empty=True
    )

    # Frontend receives these back (full url, order, is_cover)
    images = serializers.SerializerMethodField()

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
            "image_ids",   # write only
            "images",      # read only
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "owner",
            "rating",
            "review_count",
            "created_at",
            "updated_at",
        ]

    def validate_image_ids(self, value):
        if not value:
            return value

        # Remove duplicates while preserving order
        seen = set()
        unique_ids = [str(uuid) for uuid in value if str(uuid) not in seen and not seen.add(str(uuid))]

        # Verify all provided UUIDs exist in MediaFile
        existing_count = MediaFile.objects.filter(id__in=unique_ids).count()
        if existing_count != len(unique_ids):
            raise serializers.ValidationError("One or more image UUIDs are invalid or do not exist.")

        return unique_ids

    def get_images(self, obj):
        # We iterate over obj.images.all() which will use prefetched data if available
        # preventing N+1 queries when fetching a list of vehicles.
        return [
            {
                "id": str(vi.media.id) if hasattr(vi, 'media') and getattr(vi, 'media', None) else str(vi.media_id),
                "url": vi.media.secure_url if hasattr(vi, 'media') and getattr(vi, 'media', None) else "",
                "order": vi.order,
                "is_cover": vi.is_cover,
            }
            for vi in obj.images.all()
        ]

    @transaction.atomic
    def create(self, validated_data):
        image_ids = validated_data.pop("image_ids", [])
        vehicle = Vehicle.objects.create(**validated_data)
        self._save_images(vehicle, image_ids)
        
        # We return the re-fetched vehicle with prefetch_related to ensure 
        # that 'images' are serialized correctly without returning an empty array.
        return Vehicle.objects.prefetch_related('images__media').get(id=vehicle.id)

    @transaction.atomic
    def update(self, instance, validated_data):
        image_ids = validated_data.pop("image_ids", None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if image_ids is not None:
            instance.images.all().delete()
            self._save_images(instance, image_ids)
            
        # We return the re-fetched instance with prefetch_related to ensure 
        # the response includes the newly created images properly.
        return Vehicle.objects.prefetch_related('images__media').get(id=instance.id)

    def _save_images(self, vehicle, image_ids):
        if not image_ids:
            return
            
        VehicleImage.objects.bulk_create([
            VehicleImage(
                vehicle=vehicle,
                media_id=media_id,
                order=index,
                is_cover=(index == 0)
            )
            for index, media_id in enumerate(image_ids)
        ])