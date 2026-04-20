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

        if start >= end:
            raise serializers.ValidationError("End date must be after start date")
        
        booking = Booking(**data)

        if booking.is_conflicting():
            raise serializers.ValidationError("Vechile already booked for this dates")
        
        return data