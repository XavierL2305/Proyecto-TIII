from django.shortcuts import render, redirect
from django.contrib import messages

from .models import Proveedores

from .forms import ProveedorForm

from django.contrib.auth.decorators import login_required

# Create your views here.
@login_required #validacionn requerida para ingresar a proveedores
def proveedores(request):
    proveedores = Proveedores.objects.all()
    formulario = ProveedorForm()

    if request.method == 'POST':
        proveedor_id = request.POST.get('proveedor_id', '').strip()
        if proveedor_id:  # Si hay ID, es edición
            proveedor = Proveedores.objects.get(id_proveedor_PK=proveedor_id)
            formulario = ProveedorForm(request.POST, instance=proveedor)
            if formulario.is_valid():
                formulario.save()
                messages.success(request, 'Proveedor editado con éxito.')
                return redirect('proveedores:proveedores')
            else:
                messages.error(request, 'Error al editar el proveedor. Por favor, corrige los errores.')
                return redirect('proveedores:proveedores')
        else:  # Si no hay ID, es creación
            formulario = ProveedorForm(request.POST)
            if formulario.is_valid():
                formulario.save()
                messages.success(request, 'Proveedor creado con éxito.')
                return redirect('proveedores:proveedores')
            else:
                messages.error(request, 'Error al crear el proveedor. Por favor, corrige los errores.')
                return redirect('proveedores:proveedores')

    return render(
        request, 
        'pagina/proveedores.html', 
        {
        'proveedores': proveedores, 
        'formulario': formulario,
        'request': request
        })
