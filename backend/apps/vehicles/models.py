from django.db import models
from django.conf import settings
from media_manager.models import MediaFile  # add this import

class Vehicle(models.Model):
    VEHICLE_TYPE_CHOICES = (
        ("car", "Car"),
        ("bike", "Bike"),
        ("dirt-bike", "Dirt-Bike"),
        ("suv", "Suv"),
        ("electric", "Electric"),
        ("scooter", "Scooter"),
    )
    STATUS_CHOICES = (
        ("available", "Available"),
        ("unavailable", "Unavailable"),
        ("maintenance", "Maintenance"),
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="vehicles"
    )
    name = models.CharField(max_length=150)
    description = models.TextField()
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_TYPE_CHOICES)
    badge = models.CharField(max_length=50, blank=True)
    tagline = models.CharField(max_length=100, blank=True)

    # REMOVED image_id — replaced by VehicleImage below

    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="available"
    )
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    review_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

# ADD THIS — through-table connecting Vehicle to MediaFile
class VehicleImage(models.Model):
    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name="images"
    )
    media = models.ForeignKey(
        MediaFile,
        on_delete=models.PROTECT,  # prevents deleting media still attached to a vehicle
        related_name="vehicle_links"
    )
    order = models.PositiveIntegerField(default=0)  # for image ordering in gallery
    is_cover = models.BooleanField(default=False)   # which image is the main thumbnail

    class Meta:
        ordering = ["order"]
        unique_together = ("vehicle", "media")

    def __str__(self):
        return f"{self.vehicle.name} - image {self.order}"