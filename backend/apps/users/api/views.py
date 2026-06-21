from rest_framework import generics 
from .serializers import RegisterSerializer, UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import (AllowAny, IsAuthenticated,)
from rest_framework.response import Response
from rest_framework.views import APIView

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)

        return Response(serializer.data)

# avatar
class UpdateAvatarView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = AvatarUpdateSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        request.user.avatar_url = serializer.validated_data["avatar_url"]

        request.user.avatar_public_id = serializer.validated_data[
            "avatar_public_id"
        ]

        request.user.save(
            update_fields=[
                "avatar_url",
                "avatar_public_id",
            ]
        )

        return Response(
            UserSerializer(request.user).data
        )