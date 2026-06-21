from rest_framework import serializers
from apps.users.models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "email", "full_name", "password", "role"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "full_name", "avatar_url", "role"]  


class AvatarUpdateSerializer(serializers.Serializer):
    avatar_url = serializers.URLField()
    avatar_public_id = serializers.CharField(max_length=255)

# refresh token
class RefreshTokenSerializer(serializers.Serializer):
    pass