from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.paginator import Paginator

# We'll reuse the Pedido and PedidoItem models defined in home.models
from home.models import Pedido
from django.http import HttpResponseForbidden


def is_staff_or_superuser(user):
    return user.is_superuser or user.is_staff or getattr(user, 'rol', '') in ('empleado', 'vendedor', 'distribuidor')


@user_passes_test(is_staff_or_superuser)
def pedidos_list(request):
    """List all pedidos (staff/admin view)."""
    pedidos = Pedido.objects.select_related('usuario').all().order_by('-fecha')
    q = request.GET.get('q', '').strip()
    if q:
        from django.db.models import Q
        pedidos = pedidos.filter(
            Q(id_pedido_PK__icontains=q) |
            Q(usuario__username__icontains=q) |
            Q(quien__icontains=q) |
            Q(tipo_entrega__icontains=q) |
            Q(metodo_pago__icontains=q) |
            Q(total__icontains=q) |
            Q(fecha__icontains=q) |
            Q(estado__icontains=q)
        )
    paginator = Paginator(pedidos, 25)
    page = request.GET.get('page')
    page_obj = paginator.get_page(page)
    return render(request, 'pedidos/pedidos.html', {'page_obj': page_obj, 'request': request})


@login_required
def mis_pedidos(request):
    """List pedidos for the logged-in customer."""
    pedidos = Pedido.objects.filter(usuario=request.user).order_by('-fecha')
    paginator = Paginator(pedidos, 12)
    page = request.GET.get('page')
    page_obj = paginator.get_page(page)
    return render(request, 'pedidos/mis_pedidos.html', {'page_obj': page_obj})


def pedido_detail(request, pk):
    """Show detalle of a pedido. Staff can view any; user can view own pedidos."""
    pedido = get_object_or_404(Pedido, id_pedido_PK=pk)
    # permission check
    if not (request.user.is_authenticated and (request.user == pedido.usuario or is_staff_or_superuser(request.user))):
        return HttpResponseForbidden('No tienes permiso para ver este pedido')

    # Actualizar estado si es POST
    if request.method == 'POST':
        nuevo_estado = request.POST.get('estado')
        if nuevo_estado in ['pendiente', 'procesando', 'finalizado']:
            pedido.estado = nuevo_estado
            pedido.save()
        else:
            return HttpResponseForbidden('Estado inválido')
    # items are accessible via pedido.items.all()
    return render(request, 'pedidos/detail.html', {'pedido': pedido})
