from django.shortcuts import render
from django.http import HttpResponse
from app.apiDolarBcv import dataApiBcv

from productos.models import Productos
from categorias.models import Categorias

from django.contrib.auth.decorators import login_required

from .models import Carrito, DetallesCarrito

# Create your views here.

def home(request):
    #funcion para caputurar la api del bcv
    productos_list = Productos.objects.filter(status=True)
    categorias = Categorias.objects.all()
    # print(categorias)
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
