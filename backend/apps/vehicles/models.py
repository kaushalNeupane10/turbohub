from django.db import models
from django.conf import settings


class Vehicle(models.Model):

    VEHICLE_TYPE_CHOICES = (
        ("car", "Car"),
        ("bike", "Bike"),
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


    # Basic Information

    name = models.CharField(
        max_length=150
    )

    description = models.TextField()


    vehicle_type = models.CharField(
        max_length=20,
        choices=VEHICLE_TYPE_CHOICES
    )


    # Display data

    badge = models.CharField(
        max_length=50,
        blank=True
    )


    tagline = models.CharField(
        max_length=100,
        blank=True
    )


    # Cloudinary image public id

    image_id = models.CharField(
        max_length=255
    )


    # Pricing

    price_per_day = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )


    # Location

    location = models.CharField(
        max_length=255
    )


    # Status

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="available"
    )


    # Statistics

    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0
    )


    review_count = models.PositiveIntegerField(
        default=0
    )


    created_at = models.DateTimeField(
        auto_now_add=True
    )


    updated_at = models.DateTimeField(
        auto_now=True
    )


    def __str__(self):
        return self.name

class VehicleFeature(models.Model):

    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name="features"
    )


    icon = models.CharField(
        max_length=50
    )


    label = models.CharField(
        max_length=100
    )


    def __str__(self):
        return self.label