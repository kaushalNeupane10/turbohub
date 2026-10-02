"""
Public vehicle URL router — no authentication required.

Mounted at: api/vehicles/public/
"""

from rest_framework.routers import DefaultRouter
from .public_views import PublicVehicleViewSet

router = DefaultRouter()

router.register(
    "",
    PublicVehicleViewSet,
    basename="public-vehicles",
)

urlpatterns = router.urls
