from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

app_name = 'login_register'

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(template_name='login_register/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='login_register:login'), name='logout'),
    path('register/', views.register, name='register'),
]
