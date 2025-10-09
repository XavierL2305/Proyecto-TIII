from django.urls import path
from .views import proveedores, exportar_proveedores_excel

app_name = 'proveedores'

urlpatterns = [
    path('', proveedores, name='proveedores'),
    path('exportar_excel/', exportar_proveedores_excel, name='exportar_proveedores_excel'),
]
