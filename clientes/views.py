from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .forms import ClienteProfileForm
from django.contrib import messages
from .models import ClienteProfile

@login_required
def editar_perfil_cliente(request):
    perfil, created = ClienteProfile.objects.get_or_create(user=request.user)
    if request.method == 'POST':
        form = ClienteProfileForm(request.POST, instance=perfil)
        if form.is_valid():
            form.save()
            # Actualiza también el email del usuario
            email = request.POST.get('email')
            if email and email != request.user.email:
                request.user.email = email
                request.user.save()
            messages.success(request, "Perfil actualizado correctamente.")
            return redirect('clientes:editar_perfil_cliente')
        else:
            messages.error(request, "Corrige los errores.")
    else:
        form = ClienteProfileForm(instance=perfil)
    return render(request, 'clientes/editar_perfil_cliente.html', {'form': form})