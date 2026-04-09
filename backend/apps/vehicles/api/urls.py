from rest_framework.routers import DefaultRouter
from .views  import VehicleViewSet

router = DefaultRouter()
router.register("", VehicleViewSet)

urlpatterns = router.urls