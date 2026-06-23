from django.urls import path
from .views import RegisterView, LoginView, MeView, RefreshView, LogoutView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register",),
    path("login/", LoginView.as_view(), name="login",),
    path("refresh/", RefreshView.as_view()),
    path("logout/",LogoutView.as_view()),
    path("me/", MeView.as_view(), name="me",),
]