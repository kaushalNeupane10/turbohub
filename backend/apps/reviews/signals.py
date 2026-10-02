"""
Keep each Vehicle's denormalised ``rating`` and ``review_count`` in sync with
its reviews. These fields are read hot-path (public listings + ranking) so we
compute them once on write rather than aggregating on every read.
"""

from decimal import Decimal

from django.db.models import Avg, Count
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from apps.vehicles.models import Vehicle

from .models import Review


def _recalculate_vehicle_rating(vehicle_id: int) -> None:
    aggregates = Review.objects.filter(vehicle_id=vehicle_id).aggregate(
        avg=Avg("rating"),
        count=Count("id"),
    )
    avg = aggregates["avg"] or 0
    count = aggregates["count"] or 0

    Vehicle.objects.filter(pk=vehicle_id).update(
        rating=Decimal(str(round(avg, 2))),
        review_count=count,
    )


@receiver(post_save, sender=Review)
def review_saved(sender, instance, **kwargs):
    _recalculate_vehicle_rating(instance.vehicle_id)


@receiver(post_delete, sender=Review)
def review_deleted(sender, instance, **kwargs):
    _recalculate_vehicle_rating(instance.vehicle_id)
