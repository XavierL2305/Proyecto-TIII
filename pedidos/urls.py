from django.urls import path
from . import views

app_name = 'pedidos'

urlpatterns = [
    path('', views.pedidos_list, name='pedidos'),
    path('mis/', views.mis_pedidos, name='consultar_mis_pedidos'),
]
