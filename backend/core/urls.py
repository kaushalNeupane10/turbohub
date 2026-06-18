from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    #users
     path('api/users/', include('apps.users.api.urls')),
    #vechiles
    path('api/vehicles/', include('apps.vehicles.api.urls')),
    #booking
    path('api/bookings/', include('apps.bookings.api.urls')),
    # JWT Auth
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

     # auth
    path('api/auth/', include('apps.users.api.urls')),

    # payments
    path("api/payments/", include("apps.payments.api.urls")),
]
