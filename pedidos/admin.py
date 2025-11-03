from django.contrib import admin
from home.models import Pedido, PedidoItem


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ('id_pedido_PK', 'usuario', 'total', 'fecha', 'estado')
    search_fields = ('usuario__username', 'quien')
    list_filter = ('estado', 'metodo_pago')


@admin.register(PedidoItem)
class PedidoItemAdmin(admin.ModelAdmin):
    list_display = ('id_item_PK', 'pedido', 'producto', 'cantidad', 'precio_unitario')
    search_fields = ('producto__nombre',)
