from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Categorias
from .forms import CategoriasForm

def categorias(request):
    filtro = request.GET.get('filtro', 'activos')
    if filtro == 'eliminados':
        categorias = Categorias.objects.filter(status=False)
    else:
        categorias = Categorias.objects.filter(status=True)

    if request.method == 'POST':
        if 'eliminar_id' in request.POST:
            categoria = get_object_or_404(Categorias, id_categoria_PK=request.POST.get('eliminar_id'))
            categoria.status = False
            categoria.save()
            messages.success(request, "Categoría eliminada correctamente.")
            return redirect(f"{request.path}?filtro={filtro}")

        if 'activar_id' in request.POST:
            categoria = get_object_or_404(Categorias, id_categoria_PK=request.POST.get('activar_id'))
            categoria.status = True
            categoria.save()
            messages.success(request, "Categoría reactivada correctamente.")
            return redirect(f"{request.path}?filtro={filtro}")

        categoria_id = request.POST.get('categoria_id')
        if categoria_id:
            categoria = get_object_or_404(Categorias, id_categoria_PK=categoria_id)
            formulario = CategoriasForm(request.POST, instance=categoria)
            if formulario.is_valid():
                categoria.status = True  
                formulario.save()
                messages.success(request, "Categoría actualizada con éxito.")
            else:
                messages.error(request, "Corrige los errores en el formulario.")
            return redirect(f"{request.path}?filtro={filtro}")

        else:
            formulario = CategoriasForm(request.POST)
            if formulario.is_valid():
                nueva_categoria = formulario.save(commit=False)
                nueva_categoria.status = True
                nueva_categoria.save()
                messages.success(request, "Categoría creada con éxito.")
            else:
                messages.error(request, "Corrige los errores en el formulario.")
            return redirect(f"{request.path}?filtro={filtro}")

    formulario = CategoriasForm()
    return render(request, 'categorias/categorias.html', {
        'categorias': categorias,
        'filtro': filtro,
        'formulario': formulario,
    })
