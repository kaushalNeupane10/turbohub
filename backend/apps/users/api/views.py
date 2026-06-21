from rest_framework import generics 
from .serializers import RegisterSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken 
from rest_framework.permissions import (AllowAny, IsAuthenticated,)
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from rest_framework import status
from django.contrib.auth import authenticate

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

# login view
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(
            request,
            username=email,
            password=password,
        )

        if not user:
            return Response(
                {"detail": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)

        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response = Response(
            {"message": "Login successful"},
            status=status.HTTP_200_OK,
        )

        response.set_cookie(
            settings.ACCESS_COOKIE_NAME,
            access_token,
            max_age=settings.ACCESS_COOKIE_AGE,
            httponly=True,
            secure=settings.COOKIE_SECURE,
            samesite=settings.COOKIE_SAMESITE,
        )

        response.set_cookie(
            settings.REFRESH_COOKIE_NAME,
            refresh_token,
            max_age=settings.REFRESH_COOKIE_AGE,
            httponly=True,
            secure=settings.COOKIE_SECURE,
            samesite=settings.COOKIE_SAMESITE,
        )

        return response

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