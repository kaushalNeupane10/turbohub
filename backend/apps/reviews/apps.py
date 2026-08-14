from django.apps import AppConfig


class ReviewsConfig(AppConfig):
    name = 'apps.reviews'

    def ready(self):
        # Register rating-recalculation signal handlers.
        from . import signals  # noqa: F401
