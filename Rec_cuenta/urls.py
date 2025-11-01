from django.urls import path
from . import views

app_name = 'Rec_cuenta'

urlpatterns = [
path('password-reset/', views.password_reset_request, name='password_reset_request'),
path('password-reset/verify/', views.password_reset_verify, name='password_reset_verify'),
path('password-reset/set/', views.set_new_password, name='set_new_password'),
]