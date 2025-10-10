from django.contrib import admin
from .models import ClienteProfile

@admin.register(ClienteProfile)
class ClienteProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'telefono', 'direccion']
    search_fields = ['user__username', 'telefono', 'direccion']
