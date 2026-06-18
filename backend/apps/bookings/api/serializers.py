from rest_framework import serializers
from apps.bookings.models import Booking



class BookingSerializer(serializers.ModelSerializer):


    class Meta:

        model = Booking

        fields = "__all__"


        read_only_fields = [
            "user",
            "total_price",
            "status",
            "created_at",
            "updated_at"
        ]



    def validate(self, data):

        start = data.get(
            "start_date"
        )

        end = data.get(
            "end_date"
        )

        vehicle = data.get(
            "vehicle"
        )


        if start >= end:

            raise serializers.ValidationError(
                "End date must be after start date"
            )



        request = self.context.get(
            "request"
        )


        if vehicle.owner == request.user:

            raise serializers.ValidationError(
                "You cannot book your own vehicle"
            )



        conflict = Booking.objects.filter(

            vehicle=vehicle,

            start_date__lt=end,

            end_date__gt=start,

            status="confirmed"

        ).exists()



        if conflict:

            raise serializers.ValidationError(
                "Vehicle already booked for these dates"
            )



        return data



    def create(self, validated_data):

        vehicle = validated_data["vehicle"]

        start = validated_data["start_date"]

        end = validated_data["end_date"]


        days = (
            end - start
        ).days


        total_price = (
            vehicle.price_per_day * days
        )


        booking = Booking.objects.create(

            user=self.context["request"].user,

            total_price=total_price,

            **validated_data

        )


        return booking