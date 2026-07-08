from rest_framework.routers import DefaultRouter

from .views import MediaFolderViewSet, MediaFileViewSet

router = DefaultRouter()

router.register("folders", MediaFolderViewSet, basename="media-folder")
router.register("files", MediaFileViewSet, basename="media-file")

urlpatterns = router.urls