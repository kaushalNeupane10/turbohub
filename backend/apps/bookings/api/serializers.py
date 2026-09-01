from rest_framework import serializers
from apps.bookings.models import Booking


class BookingSerializer(serializers.ModelSerializer):

    # Read-only field: populated in the view after auto-creating a Payment
    # for instant-bookings.  Will be None for legacy pending bookings.
    payment_id = serializers.SerializerMethodField()

    class Meta:

        model = Booking

        fields = [
            "id",
            "user",
            "vehicle",
            "start_date",
            "end_date",
            "total_price",
            "status",
            "payment_id",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "user",
            "total_price",
            "status",
            "payment_id",
            "created_at",
            "updated_at",
        ]

    def get_payment_id(self, obj):
        """
        Returns the payment ID if one exists for this booking.
        This is populated for instant-confirmed bookings where a Payment
        record is auto-created by the view.
        """
        # Check for annotation first (set by the view on creation)
        if hasattr(obj, "_instant_payment_id"):
            return obj._instant_payment_id

        # Fallback: query the related payment (for detail / list views)
        payment = getattr(obj, "payment", None)
        if payment:
            return payment.id
        return None


    def validate(self, data):

        start = data.get("start_date")
        end = data.get("end_date")
        vehicle = data.get("vehicle")

        if start >= end:
            raise serializers.ValidationError(
                "End date must be after start date"
            )

        request = self.context.get("request")

        if vehicle.owner == request.user:
            raise serializers.ValidationError(
                "You cannot book your own vehicle"
            )

        # Check conflicts against ALL active booking statuses (pending,
        # approved, confirmed) to prevent double-booking race conditions.
        conflict = Booking.objects.filter(
            vehicle=vehicle,
            start_date__lt=end,
            end_date__gt=start,
            status__in=["pending", "approved", "confirmed"],
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

        days = (end - start).days
        total_price = vehicle.price_per_day * days

        # Instant booking: if the vehicle is available, confirm immediately
        # so the customer can proceed to payment without waiting for owner
        # approval.  This is the industry-standard instant-book flow.
        status = "confirmed" if vehicle.status == "available" else "pending"

        booking = Booking.objects.create(
            user=self.context["request"].user,
            total_price=total_price,
            status=status,
            **validated_data,
        )

        return booking