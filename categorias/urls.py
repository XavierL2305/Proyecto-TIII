from django.urls import path
from .views import categorias

app_name = "categorias"

urlpatterns = [
    path('', categorias, name='categorias'),
]
