from django.db import models
from django.conf import settings

class Vehicle(models.Model):
    VEHICLE_TYPE_CHOICES = (
        ("car","Car"),
        ("bike", "Bike"),
    )

    STATUS_CHOICES = (
        ("available", "Available"),
        ("unavailable", "UnAvailable"),
        ("maintenance", "Maintenance"),
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete = models.CASCADE,
        related_name="vehicles"
    )

    price_per_day = models.DecimalField(max_digits=10, decimal_places=2 )

    location = models.CharField(max_length=255)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="available")

    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)

    def __str__(self):
        return self.title
