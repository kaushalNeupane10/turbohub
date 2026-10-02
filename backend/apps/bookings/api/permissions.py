from rest_framework.permissions import BasePermission


class IsBookingOwner(BasePermission):
    """
    Object-level permission:
      - Staff/admin users always pass.
      - The booking creator (user) passes.
      - The vehicle owner passes (needed for approve/decline).
    """

    def has_object_permission(self, request, view, obj):
        if request.user and request.user.is_staff:
            return True

        # Booking creator
        if obj.user == request.user:
            return True

        # Vehicle owner (for approve / decline actions)
        if obj.vehicle.owner == request.user:
            return True

        return False