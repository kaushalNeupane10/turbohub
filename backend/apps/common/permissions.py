from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsOwnerOrReadOnly(BasePermission):
    
    def has_object_permission(self, request, view, obj):

        #read only request allowed to everyone
        if request.method in SAFE_METHODS:
            return True
        
        #write permissions only for owner 
        return obj.owner == request.user
    
class IsBookingOwner(BasePermission):
    
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user