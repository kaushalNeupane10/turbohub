from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from . import services
from .models import MediaFile, MediaFolder
from .permissions import CanWriteAdminSpace, IsOwnerOrAdminOfMedia
from .serializers import MediaFileSerializer, MediaFolderSerializer, MediaUploadSerializer


def _scope_queryset(qs, request):
    user = request.user
    if user.is_staff:
        space = request.query_params.get("space")
        if space == "admin":
            return qs.filter(is_admin_space=True)
        if space == "mine":
            return qs.filter(owner=user, is_admin_space=False)
        return qs  # staff sees all by default
    return qs.filter(owner=user, is_admin_space=False)


class MediaFolderViewSet(viewsets.ModelViewSet):
    serializer_class = MediaFolderSerializer
    permission_classes = [IsAuthenticated, CanWriteAdminSpace]

    def get_queryset(self):
        qs = MediaFolder.objects.all()
        qs = _scope_queryset(qs, self.request)
        parent_id = self.request.query_params.get("parent")
        if parent_id == "root" or parent_id is None:
            qs = qs.filter(parent__isnull=True) if parent_id == "root" else qs
        elif parent_id:
            qs = qs.filter(parent_id=parent_id)
        return qs

    def perform_create(self, serializer):
        is_admin_space = serializer.validated_data.get("is_admin_space", False)
        serializer.save(
            owner=None if is_admin_space else self.request.user,
        )


class MediaFileViewSet(viewsets.ModelViewSet):
    serializer_class = MediaFileSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdminOfMedia]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        qs = MediaFile.objects.select_related("folder")
        qs = _scope_queryset(qs, self.request)

        folder_id = self.request.query_params.get("folder")
        if folder_id == "root":
            qs = qs.filter(folder__isnull=True)
        elif folder_id:
            qs = qs.filter(folder_id=folder_id)

        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(
                Q(original_filename__icontains=search) | Q(public_id__icontains=search)
            )

        return qs

    @action(detail=False, methods=["post"], url_path="upload")
    def upload(self, request):
        serializer = MediaUploadSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        media = serializer.save()
        return Response(
            MediaFileSerializer(media).data, status=status.HTTP_201_CREATED
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.is_referenced:
            return Response(
                {"detail": "This media is still attached to other records and cannot be deleted."},
                status=status.HTTP_409_CONFLICT,
            )

        services.delete_media(
            public_id=instance.public_id, resource_type=instance.resource_type
        )
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)