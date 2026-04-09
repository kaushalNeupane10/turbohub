from rest_framework import serializers
from apps.vehicles.models import Vehicle

class VehicleSerializer(serializers.ModelSerializer):
    class meta :
        model = Vehicle
        fields = "__all__"
        read_only_fields = ["owner"]

