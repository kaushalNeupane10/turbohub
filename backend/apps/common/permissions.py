"""
Shared permission helpers and classes used across the API.

The project has a custom User model with an explicit ``role`` field
("customer" / "owner" / "admin") that is independent of Django's built-in
``is_staff`` flag. A user can be a business-level admin (role="admin") without
being a Django staff user, so authorization checks must consider the role — not
just ``is_staff`` — otherwise role-admins get blocked from resources they
should manage.
"""

from rest_framework.permissions import BasePermission, SAFE_METHODS


def is_platform_admin(user) -> bool:
    """
    True when the user is a platform administrator by ANY of the recognised
    signals: the custom ``role="admin"`` field, Django ``is_staff``, or
    ``is_superuser``. Central place so every permission agrees on "who is admin".
    """
    if not user or not user.is_authenticated:
        return False
    return (
        getattr(user, "role", None) == "admin"
        or bool(getattr(user, "is_staff", False))
        or bool(getattr(user, "is_superuser", False))
    )


class IsAdminRole(BasePermission):
    """Allow only platform admins (role="admin" / staff / superuser)."""

    def has_permission(self, request, view):
        return is_platform_admin(request.user)
