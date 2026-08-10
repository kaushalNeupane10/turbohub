from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth (login, register, refresh, me, logout)
    path('api/auth/', include('apps.users.api.urls')),

    # Public — no authentication required (homepage showcase)
    path('api/vehicles/public/', include('apps.vehicles.api.public_urls')),

    # Private — requires authentication (admin dashboard)
    path('api/vehicles/', include('apps.vehicles.api.urls')),
    path('api/bookings/', include('apps.bookings.api.urls')),
    path('api/payments/', include('apps.payments.api.urls')),
    path('api/media/', include('media_manager.api.urls')),

    # JWT token pair (kept for tooling/testing compatibility)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
