from rest_framework import generics 
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer

from rest_framework_simplejwt.views import TokenObtainPairView

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

class LoginView(TokenObtainPairView):
    pass