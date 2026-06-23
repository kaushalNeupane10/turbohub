from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOrReadOnly(BasePermission):
    """
    Public users:
        - Can read vehicles

    Owners:
        - Can update/delete only their own vehicles

    Admin:
        - Full access
    """

    def has_object_permission(self, request, view, obj):

        # Admin has full control
        if request.user and request.user.is_staff:
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

        # Admin access
        if request.user and request.user.is_staff:
            return True

        return obj.user == request.user