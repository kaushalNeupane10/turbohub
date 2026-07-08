import cloudinary.uploader
from django.core.exceptions import ValidationError

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024  # 10MB


def _cloudinary_folder_path(*, user, is_admin_space: bool) -> str:
    if is_admin_space:
        return "turbohub/admins/media"
    return f"turbohub/users/{user.id}/media"


def validate_upload_file(file_obj):
    if file_obj.content_type not in ALLOWED_IMAGE_TYPES:
        raise ValidationError(
            f"Unsupported file type: {file_obj.content_type}. "
            f"Allowed: {', '.join(ALLOWED_IMAGE_TYPES)}"
        )
    if file_obj.size > MAX_UPLOAD_SIZE_BYTES:
        raise ValidationError("File too large. Max size is 10MB.")


def upload_media(*, file_obj, user, is_admin_space: bool = False):
    validate_upload_file(file_obj)

    folder_path = _cloudinary_folder_path(user=user, is_admin_space=is_admin_space)

    result = cloudinary.uploader.upload(
        file_obj,
        folder=folder_path,
        resource_type="image",
        use_filename=True,
        unique_filename=True,
        overwrite=False,
    )
    return result


def delete_media(*, public_id: str, resource_type: str = "image"):
    result = cloudinary.uploader.destroy(public_id, resource_type=resource_type)
    return result