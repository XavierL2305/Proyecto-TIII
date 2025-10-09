from django.urls import path
from .views import exportar_categorias_excel, categorias

app_name = "categorias"

urlpatterns = [
    path('', categorias, name='categorias'),
    path('exportar_excel/', exportar_categorias_excel, name='exportar_categorias_excel'),
]
