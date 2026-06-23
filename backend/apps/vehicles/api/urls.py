from rest_framework.routers import DefaultRouter
from .views import VehicleViewSet


router = DefaultRouter()

router.register(
    "",
    VehicleViewSet,
    basename="vehicles"
)


urlpatterns = router.urls