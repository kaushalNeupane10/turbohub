from django.db import models
from django.conf import settings
from apps.bookings.models import Booking


User = settings.AUTH_USER_MODEL


class Payment(models.Model):

    PAYMENT_STATUS = (
        ("pending", "Pending"),
        ("successful", "Successful"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
    )


    PAYMENT_METHODS = (
        ("card", "Card"),
        ("wallet", "Wallet"),
        ("bank", "Bank"),
    )


    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="payments"
    )


    booking = models.OneToOneField(
        Booking,
        on_delete=models.PROTECT,
        related_name="payment"
    )


    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )


    currency = models.CharField(
        max_length=10,
        default="USD"
    )


    transaction_id = models.CharField(
        max_length=255,
        unique=True,
        null=True,
        blank=True
    )


    payment_method = models.CharField(
        max_length=50,
        choices=PAYMENT_METHODS,
        blank=True
    )


    status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS,
        default="pending"
    )


    failure_reason = models.TextField(
        blank=True,
        null=True
    )

    stripe_session_id = models.CharField(
    max_length=255,
    null=True,
    blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )



    updated_at = models.DateTimeField(
        auto_now=True
    )


    def __str__(self):

        return f"Payment {self.id} - {self.status}"