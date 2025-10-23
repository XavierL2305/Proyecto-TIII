from django.db import models
from login_register.models import CustomUser as Usuario
from productos.models import Productos

# Create your models here.

class Carrito(models.Model):
    id_carrito_PK = models.AutoField(primary_key=True)
    id_usuario_FK = models.ForeignKey(Usuario, on_delete=models.CASCADE, verbose_name="UsuarioFK")
    total = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Total")
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Creación")
    estatus = models.BooleanField(default=True, verbose_name="Estado")

    def __str__(self):
        return f"Carrito {self.id_carrito_PK} - Usuario {self.id_usuario_FK}"

    class Meta:
        db_table = 'carrito'  # Nombre personalizado de la tabla
        verbose_name = "Carrito"
        ordering = ['-fecha_creacion']  # Ordenar por fecha de creación descendente

class DetallesCarrito(models.Model):
    id_detalles_carrito_PK = models.AutoField(primary_key=True)
    id_carrito_FK = models.ForeignKey(Carrito, on_delete=models.CASCADE, verbose_name="DetallesCarrito")
    id_producto_FK = models.ForeignKey(Productos, on_delete=models.CASCADE, verbose_name="ProductoFK")
    cantidad = models.IntegerField(verbose_name="Cantidad")
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Subtotal")

    def __str__(self):
        return f"Producto {self.id_producto_FK} en Carrito {self.id_carrito_FK.id_carrito_PK}"

    class Meta:
        db_table = 'carrito_productos'  # Nombre personalizado de la tabla
        verbose_name = "Producto en Carrito"
        ordering = ['id_carrito_FK']  # Ordenar por ID de carrito


class Pedido(models.Model):
    id_pedido_PK = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, verbose_name="Usuario")
    quien = models.CharField(max_length=200, verbose_name="Para quien")
    tipo_entrega = models.CharField(max_length=50, verbose_name="Tipo de entrega")
    metodo_pago = models.CharField(max_length=50, verbose_name="Metodo de pago")
    total = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Total")
    fecha = models.DateTimeField(auto_now_add=True, verbose_name="Fecha del pedido")
    estado = models.CharField(max_length=30, default='pendiente')

    def __str__(self):
        return f"Pedido {self.id_pedido_PK} - Usuario {self.usuario} - {self.estado}"

    class Meta:
        db_table = 'pedidos'
        verbose_name = 'Pedido'
        ordering = ['-fecha']


class PedidoItem(models.Model):
    id_item_PK = models.AutoField(primary_key=True)
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='items')
    producto = models.ForeignKey(Productos, on_delete=models.PROTECT)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.producto} x{self.cantidad} en Pedido {self.pedido.id_pedido_PK}"

    class Meta:
        db_table = 'pedido_items'
        verbose_name = 'Item de pedido'