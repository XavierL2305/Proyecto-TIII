from django.urls import path
from . import views

app_name = "productos"

urlpatterns = [
    path('', views.productos, name='productos'),
    path('exportar_excel/', views.exportar_excel, name='exportar_excel'),
]
