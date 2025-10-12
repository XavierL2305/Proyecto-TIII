from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import ClienteProfileForm
from .models import ClienteProfile

@login_required
def editar_perfil_cliente(request):
    perfil, _ = ClienteProfile.objects.get_or_create(user=request.user)

    if request.method == 'POST':
        form = ClienteProfileForm(request.POST or None, instance=perfil, user=request.user)
        if form.is_valid():
            perfil = form.save(commit=False)

            # Actualizar datos del usuario
            user = request.user
            user.first_name = form.cleaned_data.get('first_name')
            user.last_name = form.cleaned_data.get('last_name')
            user.email = form.cleaned_data.get('email')
            user.save()

            perfil.save()
            messages.success(request, "Perfil actualizado correctamente.")
            return redirect('clientes:editar_perfil_cliente')
        else:
            messages.error(request, "Corrige los errores en el formulario.")
    else:
        form = ClienteProfileForm(instance=perfil, user=request.user)

    rol_usuario = request.user.rol if hasattr(request.user, 'rol') else 'N/A'

    return render(request, 'clientes/editar_perfil_cliente.html', {
        'form': form,
        'rol': rol_usuario
    })
