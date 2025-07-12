from django.urls import path
from . import views

app_name = 'login_register'

urlpatterns = [
    path('', views.login_register, name='login_register'),
    path('logout/', views.CustomLogoutView.as_view(), name='logout'),
]
