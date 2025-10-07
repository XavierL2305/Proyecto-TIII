from django.shortcuts import render
from django.http import HttpResponse
from app.apiDolarBcv import dataApiBcv

from productos.models import Productos
from categorias.models import Categorias
from django.db.models import Prefetch

from django.contrib.auth.decorators import login_required

from .models import Carrito, DetallesCarrito

# Create your views here.

def home(request):
    #funcion para caputurar la api del bcv
    # Traer productos activos y ordenarlos por la descripción de su categoría
    productos_list = Productos.objects.filter(status=True).select_related('categoria').order_by('categoria__descripcion', 'nombre')
    # Traer categorías activas ordenadas por su campo 'descripcion' (no existe 'categoria')
    categorias = Categorias.objects.filter(status=True).order_by('descripcion')
    if not productos_list:
        respuesta = "No hay productos disponibles"
        return render(request, 'home.html', {"respuesta": respuesta})

    return render(
        request, 'home.html',
        {
        # 'dataApiBcv': dataApiBcv,
        'productos_list': productos_list,
        'categorias': categorias,
        })

@login_required
def compra_carrito_productos(request):
    productos_carrito = DetallesCarrito.objects.all()
    productos_carrito = [1,2,3,4,5,6,7,8,9,10]
    print(productos_carrito)
    return render(
        request, 'home.html',
        {
            'productos_carrito': productos_carrito
        })


#señorsa y señores buenas tardes buenas noches buenas tardes buenas noches señoritas y señores hoy estar aqui es mi pasion que alegreia pues la musica es mi vida y la vida es la musica y la musica es alegria y la alegria es la vida y la vida es alegria y la alegria es musica y la musica es mi lengua y le mundo mi familia
#angel me pide leche y el viejo tienes canas en el culo xddd me dijo caren xddd 
#mi gente me dice que soy un crack xddd
#y yo les digo que soy un crack xddd