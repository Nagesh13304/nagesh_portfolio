from django.contrib import admin
from .models import ContactMessage

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'email',
        'subject',
        'rating_stars',   # ⭐ stars display
        'created_at',
        'is_read'
    ]

    list_filter = ['is_read', 'created_at', 'rating']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'

    def rating_stars(self, obj):
        if obj.rating:
            return '⭐' * obj.rating
        return '-'
    
    rating_stars.short_description = 'Rating'

    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
    mark_as_read.short_description = "Mark selected messages as read"

    actions = [mark_as_read]

