from django.db import models
from categorias.models import Categoria

class Productos(models.Model):
    id_producto_PK = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=120, verbose_name="Nombre")
    descripcion = models.TextField(verbose_name="Descripción")
    precio = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio")
    imagen = models.ImageField(upload_to="productos", blank=True, null=True, verbose_name="Imagen")
    status = models.BooleanField(default=True, verbose_name="Activo")
    
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, null=True, blank=True, verbose_name="Categoría")

    def __str__(self):
        return f"{self.id_producto_PK} - {self.nombre}"

    class Meta:
        db_table = "productos"
        verbose_name = "Producto"
        ordering = ["id_producto_PK"]