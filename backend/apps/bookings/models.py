from django.db import models
from django.conf import settings
from apps.vehicles.models import Vehicle

User = settings.AUTH_USER_MODEL

class Booking(models.Model) :
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)

    start_date = models.DateField()
    end_date = models.DateField()

    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(
        max_length=20, choices = [("pending", "Pending"), ("confirmed", "Confirmed"), ("cancelled", "Cancelled")], default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
       return f"{self.user} booked {self.vehicle}"
    
def is_conflicting(self):
    return Booking.objects.filter(
        vehicle=self.vehicle,
        start_date__lt=self.end_date,
        end_date__gt=self.start_date,
        status="confirmed"
    ).exists()
