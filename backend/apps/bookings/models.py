from django.db import models
from django.conf import settings
from apps.vehicles.models import Vehicle


User = settings.AUTH_USER_MODEL


class Booking(models.Model):

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
        ("completed", "Completed"),
    )


    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="bookings"
    )


    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.PROTECT,
        related_name="bookings"
    )


    start_date = models.DateField()

    end_date = models.DateField()


    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )


    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )


    created_at = models.DateTimeField(
        auto_now_add=True
    )


    updated_at = models.DateTimeField(
        auto_now=True
    )


    class Meta:

        ordering = [
            "-created_at"
        ]

        indexes = [

            models.Index(
                fields=[
                    "vehicle",
                    "start_date",
                    "end_date"
                ]
            ),

            models.Index(
                fields=[
                    "status"
                ]
            )
        ]



    def __str__(self):

        return f"{self.user} booked {self.vehicle}"



    def is_conflicting(self):

        return Booking.objects.filter(

            vehicle=self.vehicle,

            start_date__lt=self.end_date,

            end_date__gt=self.start_date,

            status="confirmed"

        ).exists()