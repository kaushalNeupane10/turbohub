from rest_framework import serializers
from apps.bookings.models import Booking


class BookingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Booking
        fields = "__all__"
        read_only_fields = ["user", "total_price", "status"]

    def validate(self, data):
        start = data["start_date"]
        end = data["end_date"]
        vehicle = data["vehicle"]

        # date validation
        if start >= end:
            raise serializers.ValidationError(
                "End date must be after start date"
            )

        # prevent booking own vehicle
        if vehicle.owner == self.context["request"].user:
            raise serializers.ValidationError(
                "You cannot book your own vehicle"
            )

        # booking conflict check
        booking = Booking(**data)

        if booking.is_conflicting():
            raise serializers.ValidationError(
                "Vehicle already booked for these dates"
            )

        return data