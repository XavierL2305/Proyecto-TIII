from django.db import models

# Create your models here.

class Proveedores(models.Model):
    id_proveedor_PK = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, verbose_name="Nombre")
    direccion = models.CharField(max_length=200, verbose_name="Dirección")
    telefono = models.CharField(max_length=15, verbose_name="Teléfono")
    email = models.EmailField(verbose_name="Correo Electrónico", null=True)

    def __str__(self):
        return f"{self.id_proveedor_PK}-{self.nombre}"

    class Meta:
        db_table = 'proveedores'  # Nombre personalizado de la tabla
        verbose_name = "Proveedor"
        ordering = ['id_proveedor_PK']  # Ordenar por nombre al listar proveedores