from rest_framework.permissions import BasePermission


class IsOwnerOrAdminOfMedia(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.is_staff:
            return True
        return obj.owner_id == user.id and not obj.is_admin_space


class CanWriteAdminSpace(BasePermission):
    def has_permission(self, request, view):
        is_admin_target = request.data.get("is_admin_space") in (True, "true", "True")
        if is_admin_target:
            return request.user.is_staff
        return True