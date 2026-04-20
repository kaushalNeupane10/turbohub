from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    #users
     path('api/users/', include('apps.users.api.urls')),
    #vechiles
    path('api/vehicles/', include('apps.vehicles.api.urls')),
    #booking
    path('api/bookings', include('apps.bookings.api.urls')),
]
