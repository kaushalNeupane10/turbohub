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