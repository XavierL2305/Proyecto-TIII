from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('add-to-cart/', views.add_to_cart, name='add_to_cart'),
    path('remove-from-cart/', views.remove_from_cart, name='remove_from_cart'),
    path('update-cart-item/', views.update_cart_item, name='update_cart_item'),
    path('comprar-carrito/', views.comprar_carrito, name='comprar_carrito'),
]