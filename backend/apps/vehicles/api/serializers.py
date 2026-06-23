from rest_framework import serializers
from apps.vehicles.models import Vehicle


class VehicleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vehicle
        fields = "__all__"
        read_only_fields = [
            "owner",
            "rating",
            "review_count",
            "created_at",
            "updated_at",
        ]