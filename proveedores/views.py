from django.shortcuts import render, redirect
from django.contrib import messages

from .models import Proveedores

from .forms import ProveedorForm

from django.contrib.auth.decorators import login_required

# Create your views here.
@login_required #validacionn requerida para ingresar a proveedores
def proveedores(request):
    proveedores = Proveedores.objects.filter(estatus=True).order_by('id_proveedor_PK')
    formulario = ProveedorForm()
    campos = {
        'nombre': 'Nombre',
        'telefono': 'Teléfono',
        'correo': 'Correo Electrónico',
        'direccion': 'Dirección',
        'contacto': 'Contacto',
        'estatus': 'Estatus'
    }

    if request.method == 'POST':
        proveedor_id = request.POST.get('proveedor_id', '').strip()
        # Eliminar (lógica)
        if 'button_eliminar' in request.POST and proveedor_id:
            proveedor = Proveedores.objects.get(id_proveedor_PK=proveedor_id)
            if proveedor.estatus == False:
                proveedor.estatus = True
            else:
                proveedor.estatus = False
            proveedor.save()
            messages.success(request, 'Proveedor eliminado correctamente.')
            return redirect('proveedores:proveedores')
        # Editar
        elif proveedor_id:
            proveedor = Proveedores.objects.get(id_proveedor_PK=proveedor_id)
            formulario = ProveedorForm(request.POST, instance=proveedor)
            if formulario.is_valid():
                proveedor = formulario.save(commit=False)
                proveedor.estatus = True
                formulario.save()
                messages.success(request, 'Proveedor editado con éxito.')
                return redirect('proveedores:proveedores')
            else:
                messages.error(request, 'Error al editar el proveedor. Por favor, corrige los errores.')
                return redirect('proveedores:proveedores')
        # Crear
        else:
            formulario = ProveedorForm(request.POST)
            if formulario.is_valid():
                proveedor = formulario.save(commit=False)
                proveedor.estatus = True
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
        'request': request,
        'campos': campos
        })
