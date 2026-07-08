from rest_framework import serializers
from apps.vehicles.models import Vehicle, VehicleFeature, VehicleImage
from media_manager.models import MediaFile


class VehicleFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleFeature
        fields = ["id", "icon", "label"]


class VehicleSerializer(serializers.ModelSerializer):
    features = VehicleFeatureSerializer(many=True, read_only=True)

    # Frontend sends these UUIDs when creating/updating
    image_ids = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True,
        required=False
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
            "features",
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

    def get_images(self, obj):
        return [
            {
                "id": str(vi.media.id),
                "url": vi.media.secure_url,
                "order": vi.order,
                "is_cover": vi.is_cover,
            }
            for vi in obj.images.select_related("media").all()
        ]

    def create(self, validated_data):
        image_ids = validated_data.pop("image_ids", [])
        vehicle = Vehicle.objects.create(**validated_data)
        self._save_images(vehicle, image_ids)
        return vehicle

    def update(self, instance, validated_data):
        image_ids = validated_data.pop("image_ids", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if image_ids is not None:
            instance.images.all().delete()
            self._save_images(instance, image_ids)
        return instance

    def _save_images(self, vehicle, image_ids):
        VehicleImage.objects.bulk_create([
            VehicleImage(
                vehicle=vehicle,
                media_id=media_id,
                order=index,
                is_cover=(index == 0)
            )
            for index, media_id in enumerate(image_ids)
        ])