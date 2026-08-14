from rest_framework import serializers

from apps.reviews.models import Review


class ReviewSerializer(serializers.ModelSerializer):
    """
    Read/write serializer for vehicle reviews.

    ``user`` is assigned from the request in the view, and the reviewer's
    display fields are exposed read-only for rendering the review list.
    """

    user_name = serializers.CharField(source="user.full_name", read_only=True)
    user_avatar = serializers.CharField(source="user.avatar_url", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "vehicle",
            "user",
            "user_name",
            "user_avatar",
            "rating",
            "comment",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "created_at",
            "updated_at",
        ]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def validate(self, data):
        """
        Prevent a user from reviewing the same vehicle twice (create only).
        On update the instance already exists, so we skip this check.
        """
        request = self.context.get("request")
        vehicle = data.get("vehicle")

        if self.instance is None and request and vehicle is not None:
            already = Review.objects.filter(
                vehicle=vehicle,
                user=request.user,
            ).exists()
            if already:
                raise serializers.ValidationError(
                    "You have already reviewed this vehicle."
                )

        return data
