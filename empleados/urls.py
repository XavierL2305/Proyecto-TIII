from django.urls import path
from .views import gestion_empleados, exportar_empleados_excel

app_name = 'empleados'

urlpatterns = [
    path('', gestion_empleados, name='gestion_empleados'),
    path('exportar_excel/', exportar_empleados_excel, name='exportar_empleados_excel'),
]