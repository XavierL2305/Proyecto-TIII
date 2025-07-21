from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser
from .forms import CustomUserCreationForm, CustomUserChangeForm

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ['username', 'email', 'rol', 'is_cliente', 'is_staff', 'is_superuser']
    list_filter = ['rol', 'is_cliente', 'is_staff', 'is_superuser', 'is_active']
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('rol', 'is_cliente')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('rol', 'is_cliente')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
