from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ADMINISTRADOR = 'admin'
    EMPLEADO = 'empleado'
    VENDEDOR = 'vendedor'
    DISTRIBUIDOR = 'distribuidor'
    CLIENTE = 'cliente'

    ROL_CHOICES = [
        (ADMINISTRADOR, 'Administrador'),
        (EMPLEADO, 'Empleado'),
        (VENDEDOR, 'Vendedor'),
        (DISTRIBUIDOR, 'Distribuidor'),
        (CLIENTE, 'Cliente'),
    ]

    rol = models.CharField(max_length=20, choices=ROL_CHOICES, default=CLIENTE)
    is_cliente = models.BooleanField(default=False)
