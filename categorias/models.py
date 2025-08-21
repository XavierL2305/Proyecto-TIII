from django.db import models

class Categoria(models.Model):
    id_categoria_PK = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=200, verbose_name="Descripción")
    status = models.BooleanField(default=True, verbose_name="Activo")  # True = Activo, False = Inactivo

    def __str__(self):
        return self.descripcion

    class Meta:
        db_table = "categorias"
        verbose_name = "Categoría"
        ordering = ["id_categoria_PK"]
