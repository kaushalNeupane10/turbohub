from rest_framework.permissions import BasePermission


class IsBookingOwner(BasePermission):

    def has_object_permission(self, request, view, obj):

        if request.user and request.user.is_staff:
            return True

        return obj.user == request.user