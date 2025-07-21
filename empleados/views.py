from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import get_user_model
from django.contrib import messages
from django.views.decorators.http import require_http_methods
from .forms import EmpleadoCreationForm, EmpleadoChangeForm

User = get_user_model()

def es_admin(user):
    return user.is_authenticated and user.rol == 'admin'

@login_required
@user_passes_test(es_admin)
@require_http_methods(["GET", "POST"])
def gestion_empleados(request):
    # Crear empleado
    if request.method == 'POST' and 'crear' in request.POST:
        form_crear = EmpleadoCreationForm(request.POST)
        if form_crear.is_valid():
            form_crear.save()
            messages.success(request, 'Empleado creado correctamente.')
            return redirect('empleados:gestion_empleados')  # Namespace usado aquí
        else:
            messages.error(request, 'Error al crear empleado. Revisa los datos.')
    else:
        form_crear = EmpleadoCreationForm()

    # Editar empleado
    if request.method == 'POST' and 'editar' in request.POST:
        empleado_id = request.POST.get('empleado_id')
        empleado = get_object_or_404(User, pk=empleado_id)
        form_editar = EmpleadoChangeForm(request.POST, instance=empleado)
        if form_editar.is_valid():
            form_editar.save()
            messages.success(request, 'Empleado actualizado correctamente.')
            return redirect('empleados:gestion_empleados')
        else:
            messages.error(request, 'Error al actualizar empleado.')
    else:
        form_editar = EmpleadoChangeForm()

    # Eliminar empleado
    if request.method == 'POST' and 'eliminar' in request.POST:
        empleado_id = request.POST.get('eliminar_id')
        empleado = get_object_or_404(User, pk=empleado_id)
        try:
            empleado.delete()
            messages.success(request, 'Empleado eliminado correctamente.')
        except Exception:
            messages.error(request, 'Error al eliminar empleado.')
        return redirect('empleados:gestion_empleados')

    # Filtrar usuarios que no sean clientes ni superusuarios
    empleados = User.objects.exclude(rol=User.CLIENTE).exclude(is_superuser=True)

    return render(request, 'empleados/gestion_empleados.html', {
        'empleados': empleados,
        'form_crear': form_crear,
        'form_editar': form_editar,
    })
