from rest_framework.permissions import SAFE_METHODS, BasePermission

from apps.common.permissions import is_platform_admin


class IsReviewAuthorOrReadOnly(BasePermission):
    """
    - Anyone can read reviews (list is public).
    - Only authenticated users can create.
    - Only the review's author (or a platform admin) can edit/delete it.
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        if is_platform_admin(request.user):
            return True
        return obj.user == request.user
