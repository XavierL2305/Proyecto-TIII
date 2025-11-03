from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.paginator import Paginator

# We'll reuse the Pedido and PedidoItem models defined in home.models
from home.models import Pedido


def is_staff_or_superuser(user):
    return user.is_superuser or user.is_staff or getattr(user, 'rol', '') in ('empleado', 'vendedor', 'distribuidor')


@user_passes_test(is_staff_or_superuser)
def pedidos_list(request):
    """List all pedidos (staff/admin view)."""
    pedidos = Pedido.objects.select_related('usuario').all().order_by('-fecha')
    paginator = Paginator(pedidos, 25)
    page = request.GET.get('page')
    page_obj = paginator.get_page(page)
    return render(request, 'pedidos/pedidos.html', {'page_obj': page_obj})


@login_required
def mis_pedidos(request):
    """List pedidos for the logged-in customer."""
    pedidos = Pedido.objects.filter(usuario=request.user).order_by('-fecha')
    paginator = Paginator(pedidos, 12)
    page = request.GET.get('page')
    page_obj = paginator.get_page(page)
    return render(request, 'pedidos/mis_pedidos.html', {'page_obj': page_obj})
