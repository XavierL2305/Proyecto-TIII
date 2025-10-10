from django.urls import path
from . import views

app_name = 'clientes'

urlpatterns = [
    path('editar-perfil/', views.editar_perfil_cliente, name='editar_perfil_cliente'),
]