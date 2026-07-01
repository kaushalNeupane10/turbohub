from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from . import services
from .models import MediaFile, MediaFolder


class MediaFolderSerializer(serializers.ModelSerializer):
    children_count = serializers.SerializerMethodField()
    files_count = serializers.SerializerMethodField()

    class Meta:
        model = MediaFolder
        fields = [
            "id",
            "name",
            "parent",
            "is_admin_space",
            "owner",
            "created_at",
            "updated_at",
            "children_count",
            "files_count",
        ]
        read_only_fields = ["id", "owner", "created_at", "updated_at"]

    def get_children_count(self, obj):
        return obj.children.count()

    def get_files_count(self, obj):
        return obj.files.count()

    def validate(self, attrs):
        # Prevent a folder from being its own ancestor on update
        instance = getattr(self, "instance", None)
        parent = attrs.get("parent")
        if instance and parent:
            node = parent
            while node is not None:
                if node.id == instance.id:
                    raise serializers.ValidationError(
                        "A folder cannot be nested inside itself."
                    )
                node = node.parent
        return attrs


class MediaFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaFile
        fields = [
            "id",
            "owner",
            "is_admin_space",
            "folder",
            "public_id",
            "resource_type",
            "format",
            "secure_url",
            "file_type",
            "width",
            "height",
            "bytes",
            "original_filename",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "owner",
            "public_id",
            "resource_type",
            "format",
            "secure_url",
            "width",
            "height",
            "bytes",
            "created_at",
        ]


class MediaUploadSerializer(serializers.Serializer):

    file = serializers.ImageField()
    folder = serializers.PrimaryKeyRelatedField(
        queryset=MediaFolder.objects.all(), required=False, allow_null=True
    )
    is_admin_space = serializers.BooleanField(required=False, default=False)

    def validate_is_admin_space(self, value):
        request = self.context["request"]
        if value and not request.user.is_staff:
            raise serializers.ValidationError(
                "Only admins can upload into the admin media space."
            )
        return value

    def create(self, validated_data):
        request = self.context["request"]
        user = request.user
        file_obj = validated_data["file"]
        folder = validated_data.get("folder")
        is_admin_space = validated_data.get("is_admin_space", False)

        try:
            result = services.upload_media(
                file_obj=file_obj, user=user, is_admin_space=is_admin_space
            )
        except DjangoValidationError as exc:
            raise serializers.ValidationError({"file": exc.messages})

        media = MediaFile.objects.create(
            owner=None if is_admin_space else user,
            is_admin_space=is_admin_space,
            folder=folder,
            public_id=result["public_id"],
            resource_type=result.get("resource_type", "image"),
            format=result.get("format", ""),
            secure_url=result["secure_url"],
            file_type=MediaFile.FileType.IMAGE,
            width=result.get("width"),
            height=result.get("height"),
            bytes=result.get("bytes"),
            original_filename=getattr(file_obj, "name", ""),
        )
        return media