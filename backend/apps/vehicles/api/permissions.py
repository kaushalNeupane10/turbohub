from rest_framework.permissions import BasePermission, SAFE_METHODS

from apps.common.permissions import is_platform_admin


class IsOwnerOrReadOnly(BasePermission):
    """
    Public users:
        - Can read vehicles

    Owners:
        - Can update/delete only their own vehicles

    Admin (role="admin" / staff / superuser):
        - Full access to every vehicle
    """

    def has_object_permission(self, request, view, obj):

        # Platform admins have full control (role-based, not just is_staff).
        if is_platform_admin(request.user):
            return True

        # Anyone can view
        if request.method in SAFE_METHODS:
            return True

        # Only owner can modify
        return obj.owner == request.user



class IsBookingOwner(BasePermission):
    """
    Only the user who created the booking
    can access/modify their booking.
    """

    def has_object_permission(self, request, view, obj):

        # Platform admins have full access.
        if is_platform_admin(request.user):
            return True

        return obj.user == request.user
