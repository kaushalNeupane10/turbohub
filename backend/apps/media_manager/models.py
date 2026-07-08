import uuid

from django.conf import settings
from django.db import models


class MediaFolder(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=120)
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        related_name="children",
        on_delete=models.CASCADE,
    )

    # Ownership / space scoping
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        related_name="media_folders",
        on_delete=models.CASCADE,
        help_text="Null when is_admin_space=True (admin-owned folder).",
    )
    is_admin_space = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        constraints = [
            models.UniqueConstraint(
                fields=["owner", "parent", "name", "is_admin_space"],
                name="unique_folder_name_per_parent_per_space",
            )
        ]
        indexes = [
            models.Index(fields=["owner", "is_admin_space"]),
        ]

    def __str__(self):
        return self.name


class MediaFile(models.Model):

    class FileType(models.TextChoices):
        IMAGE = "image", "Image"
        VIDEO = "video", "Video"
        RAW = "raw", "Raw"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        related_name="media_files",
        on_delete=models.CASCADE,
    )
    is_admin_space = models.BooleanField(default=False)

    folder = models.ForeignKey(
        MediaFolder,
        null=True,
        blank=True,
        related_name="files",
        on_delete=models.SET_NULL,
    )

    # Cloudinary identifiers — required for delete/transform calls
    public_id = models.CharField(max_length=255, unique=True)
    resource_type = models.CharField(max_length=20, default="image")  # image|video|raw
    format = models.CharField(max_length=20, blank=True)  # jpg, png, webp...

    secure_url = models.URLField()
    file_type = models.CharField(
        max_length=20, choices=FileType.choices, default=FileType.IMAGE
    )

    # Useful metadata returned free by Cloudinary — saves extra API calls later
    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    bytes = models.PositiveIntegerField(null=True, blank=True)

    original_filename = models.CharField(max_length=255, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["owner", "is_admin_space"]),
            models.Index(fields=["folder"]),
        ]

    def __str__(self):
        return self.public_id

    @property
    def is_referenced(self) -> bool:
        return False