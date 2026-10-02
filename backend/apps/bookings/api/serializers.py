from rest_framework import serializers
from apps.bookings.models import Booking


# ─── Nested read-only serializers ─────────────────────────────────────────────

class BookingVehicleSerializer(serializers.Serializer):
    """Lightweight vehicle summary embedded in booking detail responses."""
    id = serializers.IntegerField()
    name = serializers.CharField()
    vehicle_type = serializers.CharField()
    price_per_day = serializers.DecimalField(max_digits=10, decimal_places=2)
    location = serializers.CharField()
    cover_image = serializers.SerializerMethodField()

    def get_cover_image(self, obj):
        """Return the Cloudinary secure URL of the first (cover) image, or None."""
        first_image = obj.images.order_by("order").first()
        media = getattr(first_image, "media", None) if first_image else None
        if media:
            return media.secure_url
        return None


class BookingUserSerializer(serializers.Serializer):
    """Lightweight user summary embedded in booking detail responses."""
    id = serializers.IntegerField()
    full_name = serializers.CharField()
    email = serializers.EmailField()


class BookingPaymentSerializer(serializers.Serializer):
    """
    Full payment record embedded in booking detail responses.
    Returns None if no payment has been initiated yet.
    """
    id = serializers.IntegerField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    currency = serializers.CharField()
    status = serializers.CharField()
    payment_method = serializers.CharField()
    transaction_id = serializers.CharField(allow_null=True)
    stripe_session_id = serializers.CharField(allow_null=True)
    created_at = serializers.DateTimeField()


# ─── Write serializer (create / update) ──────────────────────────────────────

class BookingSerializer(serializers.ModelSerializer):

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
            "owner_notes",
            "payment_id",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "user",
            "total_price",
            "status",
            "owner_notes",
            "payment_id",
            "created_at",
            "updated_at",
        ]

    def get_payment_id(self, obj):
        """
        Returns the payment ID if one exists for this booking.
        """
        if hasattr(obj, "_instant_payment_id"):
            return obj._instant_payment_id
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
        """
        All new bookings start as 'pending' — vehicle owners must explicitly
        approve before payment can be initiated.
        """
        vehicle = validated_data["vehicle"]
        start = validated_data["start_date"]
        end = validated_data["end_date"]

        days = (end - start).days
        total_price = vehicle.price_per_day * days

        booking = Booking.objects.create(
            user=self.context["request"].user,
            total_price=total_price,
            status="pending",
            **validated_data,
        )

        return booking


# ─── Read serializer (list / retrieve / action responses) ────────────────────

class BookingDetailSerializer(serializers.ModelSerializer):
    """
    Rich read-only serializer used for list, retrieve, and action responses.
    Includes nested vehicle, user, and payment detail objects so the frontend
    has everything it needs without additional API calls.
    """
    payment_detail = serializers.SerializerMethodField()
    vehicle_detail = BookingVehicleSerializer(source="vehicle", read_only=True)
    user_detail = BookingUserSerializer(source="user", read_only=True)

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
            "owner_notes",
            "vehicle_detail",
            "user_detail",
            "payment_detail",
            "created_at",
            "updated_at",
        ]

    def get_payment_detail(self, obj):
        """
        Returns full payment details if a payment record exists, else None.
        Uses select_related/prefetch from the view queryset — no extra queries.
        """
        payment = getattr(obj, "payment", None)
        if not payment:
            return None
        return BookingPaymentSerializer(payment).data