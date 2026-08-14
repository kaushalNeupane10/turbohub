from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

from apps.vehicles.models import Vehicle


class Review(models.Model):
    """
    A customer's star rating + comment for a vehicle.

    One review per (user, vehicle) — enforced by unique_together. Whenever a
    review is created, updated or deleted, the parent vehicle's denormalised
    ``rating`` and ``review_count`` are recalculated (see signals.py) so the
    public showcase and ranking algorithm stay in sync without extra queries.
    """

    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name="reviews",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reviews",
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Star rating from 1 to 5.",
    )
    comment = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        unique_together = ("vehicle", "user")
        indexes = [
            models.Index(fields=["vehicle", "-created_at"]),
        ]

    def __str__(self):
        return f"{self.user} → {self.vehicle} ({self.rating}★)"
