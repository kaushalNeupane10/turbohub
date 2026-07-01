from rest_framework.routers import DefaultRouter

from .views import MediaFileViewSet, MediaFolderViewSet

router = DefaultRouter()
router.register("", MediaFolderViewSet, basename="media-folder")
router.register("", MediaFileViewSet, basename="media-file")

urlpatterns = router.urls

