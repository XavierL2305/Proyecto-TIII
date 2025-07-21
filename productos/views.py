from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Productos
from .forms import ProductoForm

def productos(request):
    filtro = request.GET.get('filtro', 'activos')

    if filtro == 'eliminados':
        productos = Productos.objects.filter(status=False)
    else:
        productos = Productos.objects.filter(status=True)

    formulario = ProductoForm()

    if request.method == 'POST':

        if 'eliminar_id' in request.POST:
            try:
                producto = Productos.objects.get(id_producto_PK=request.POST.get('eliminar_id'))
                producto.status = False
                producto.save()
                messages.success(request, "Producto eliminado correctamente.")
            except Exception as e:
                messages.error(request, "Error: " + str(e))
            return redirect(f"{request.path}?filtro={filtro}")

        if 'activar_id' in request.POST:
            try:
                producto = Productos.objects.get(id_producto_PK=request.POST.get('activar_id'))
                producto.status = True
                producto.save()
                messages.success(request, "Producto reactivado correctamente.")
            except Exception as e:
                messages.error(request, "Error al reactivar: " + str(e))
            return redirect(f"{request.path}?filtro={filtro}")

        producto_id = request.POST.get('producto_id')

        if producto_id:
            producto = Productos.objects.get(id_producto_PK=producto_id)
            formulario = ProductoForm(request.POST, request.FILES, instance=producto)
            if formulario.is_valid():
                formulario.save()
                messages.success(request, "Producto actualizado con éxito.")
            else:
                messages.error(request, "Corrige los errores en el formulario.")
            return redirect(f"{request.path}?filtro={filtro}")

        else:
            formulario = ProductoForm(request.POST, request.FILES)
            if formulario.is_valid():
                formulario.save()
                messages.success(request, "Producto creado con éxito.")
            else:
                messages.error(request, "Corrige los errores en el formulario.")
            return redirect(f"{request.path}?filtro={filtro}")

    return render(request, 'productos/productos.html', {
        'productos': productos,
        'formulario': formulario,
        'filtro': filtro,
    })