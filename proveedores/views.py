from django.shortcuts import render, redirect
from django.contrib import messages

from .models import Proveedores

from .forms import ProveedorForm

from django.contrib.auth.decorators import login_required

# Create your views here.
@login_required #validacionn requerida para ingresar a proveedores
def proveedores(request):
    formulario = ProveedorForm(request.POST or None) # Crear una instancia del formulario
    proveedores = Proveedores.objects.all()  # Obtener todos los proveedores
    if request.method == 'POST':
        if formulario.is_valid():
            formulario.save()  # Guardar el proveedor si el formulario es válido
            messages.success(request, 'Proveedor guardado con éxito.')
            return redirect('proveedores:proveedores')  # Redirigir a la misma vista después de guardar
    print(formulario.errors)  # Imprimir errores del formulario en la consola para depuración
    return render(request, 'pagina/proveedores.html', {'proveedores': proveedores, 'formulario': formulario})
