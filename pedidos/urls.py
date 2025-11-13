from django.urls import path
from . import views

app_name = 'pedidos'

urlpatterns = [
    path('', views.pedidos_list, name='pedidos'),
    path('<int:pk>/', views.pedido_detail, name='detalle'),
    path('mis/', views.mis_pedidos, name='consultar_mis_pedidos'),
]
