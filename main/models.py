from django.db import models
from django.utils import timezone

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200, blank=True, null=True)  # Optional
    message = models.TextField(blank=True, null=True)  # Optional

    rating = models.PositiveSmallIntegerField(
        choices=[(i, i) for i in range(1, 6)],
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(default=timezone.now)
    is_read = models.BooleanField(default=False)

   
    

