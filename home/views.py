from django.shortcuts import render
from django.http import HttpResponse
from app.apiDolarBcv import dataApiBcv

from productos.models import Productos
from categorias.models import Categorias
from django.db.models import Prefetch

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.shortcuts import get_object_or_404
from django.db.models import Sum

from .models import Carrito, DetallesCarrito

# Create your views here.

def home(request):
    #funcion para caputurar la api del bcv
    # Traer productos activos y ordenarlos por la descripción de su categoría
    productos_list = Productos.objects.filter(status=True).select_related('categoria').order_by('categoria__descripcion', 'nombre')
    # Traer categorías activas ordenadas por su campo 'descripcion' (no existe 'categoria')
    categorias = Categorias.objects.filter(status=True).order_by('descripcion')

    if request.user.is_authenticated:
        productos_carrito = (
            DetallesCarrito.objects
            .filter(id_carrito_FK__id_usuario_FK=request.user, id_carrito_FK__estatus=True)
            .select_related('id_producto_FK')
            .values(
                'id_detalles_carrito_PK', 'cantidad', 'subtotal',
                'id_producto_FK__id_producto_PK', 'id_producto_FK__nombre',
                'id_producto_FK__precio', 'id_producto_FK__imagen'
            )
        )
    else:
        productos_carrito = DetallesCarrito.objects.none()

    if not productos_list:
        respuesta = "No hay productos disponibles"
        return render(request, 'home.html', {"respuesta": respuesta})

    return render(
        request, 'home.html',
        {
        # 'dataApiBcv': dataApiBcv,
        'productos_list': productos_list,
        'categorias': categorias,
        'user': request.user,
        'productos_carrito': productos_carrito
        })


@login_required
@require_POST
def add_to_cart(request):
    """Recibe POST con 'product_id' y 'cantidad' y añade/actualiza el detalle en el carrito del usuario."""
    try:
        product_id = int(request.POST.get('product_id'))
        cantidad = int(request.POST.get('cantidad', 1))
    except (TypeError, ValueError):
        return JsonResponse({'ok': False, 'error': 'Parametros invalidos'}, status=400)

    # Obtener producto o 404
    producto = get_object_or_404(Productos, id_producto_PK=product_id)

    # Obtener o crear carrito activo para el usuario
    carrito_obj, created = Carrito.objects.get_or_create(id_usuario_FK=request.user, estatus=True, defaults={'total': 0})

    # Buscar detalle existente: si ya existe, no agregamos (solo añadir si no existe)
    detalle = DetallesCarrito.objects.filter(id_carrito_FK=carrito_obj, id_producto_FK=producto).first()
    if detalle:
        # Producto ya está en el carrito: no aumentamos cantidad por ahora
        return JsonResponse({'ok': False, 'error': 'exists', 'message': 'Producto ya en el carrito', 'cantidad': detalle.cantidad})
    else:
        subtotal = cantidad * producto.precio
        detalle = DetallesCarrito.objects.create(id_carrito_FK=carrito_obj, id_producto_FK=producto, cantidad=cantidad, subtotal=subtotal)

    # Recalcular total del carrito
    total = DetallesCarrito.objects.filter(id_carrito_FK=carrito_obj).aggregate(Sum('subtotal'))['subtotal__sum'] or 0
    carrito_obj.total = total
    carrito_obj.save()

    return JsonResponse({'ok': True, 'producto': {'id': producto.id_producto_PK, 'nombre': producto.nombre, 'precio': str(producto.precio)}, 'cantidad': detalle.cantidad, 'total': str(carrito_obj.total)})


#señorsa y señores buenas tardes buenas noches buenas tardes buenas noches señoritas y señores hoy estar aqui es mi pasion que alegreia pues la musica es mi vida y la vida es la musica y la musica es alegria y la alegria es la vida y la vida es alegria y la alegria es musica y la musica es mi lengua y le mundo mi familia
#angel me pide leche y el viejo tienes canas en el culo xddd me dijo caren xddd 
#mi gente me dice que soy un crack xddd
#y yo les digo que soy un crack xddd
