from rest_framework import viewsets, permissions
from apps.vehicles.models import Vehicle
from .serializers import VehicleSerializer

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer): 
        serializer.save(owner = self.request.user)

