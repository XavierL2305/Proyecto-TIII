from django.db import models

class Categorias(models.Model):
    id_categoria_PK = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=120)
    status = models.BooleanField(default=True)

    def __str__(self):
        return self.descripcion

    class Meta:
        db_table = "categorias"
        verbose_name = "Categorías"
        ordering = ["id_categoria_PK"]
