from django.contrib import admin
from .models import Productos

@admin.register(Productos)
class ProductosAdmin(admin.ModelAdmin):
    list_display = ('id_producto_PK', 'nombre', 'precio', 'status')
    list_filter = ('status',)
