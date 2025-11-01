from app.apiDolarBcv import dataApiBcv

from productos.models import Productos
from categorias.models import Categorias

from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST, require_POST, require_GET
from django.template.loader import render_to_string
from django.core import serializers
from django.db import transaction
from django.db.models import Sum, Prefetch, F

from .models import Carrito, DetallesCarrito, Pedido, PedidoItem
from login_register.models import CustomUser

from .form import DetallesCarritoForm
import urllib.parse
from django.conf import settings
# try:
#     from weasyprint import HTML
#     WEEASY_AVAILABLE = True
#     WEEASY_IMPORT_ERROR = None
# except Exception as e:
#     # WeasyPrint or its native dependencies are not available (e.g., libgobject, pango, cairo)
#     HTML = None
#     WEEASY_AVAILABLE = False
#     WEEASY_IMPORT_ERROR = str(e)

# Prefer wkhtmltopdf via pdfkit when available (user chose wkhtmltopdf)
try:
    import pdfkit
    PDFKIT_AVAILABLE = True
    PDFKIT_IMPORT_ERROR = None
except Exception as e:
    pdfkit = None
    PDFKIT_AVAILABLE = False
    PDFKIT_IMPORT_ERROR = str(e)

# Create your views here.

def home(request):
    #funcion para caputurar la api del bcv
    # Traer productos activos y ordenarlos por la descripción de su categoría
    productos_list = Productos.objects.filter(status=True).select_related('categoria').order_by('categoria__descripcion', 'nombre')
    # Traer categorías activas ordenadas por su campo 'descripcion' (no existe 'categoria')
    categorias = Categorias.objects.filter(status=True).order_by('descripcion')
    
    if request.user.is_authenticated:
        productos_carrito = (
            DetallesCarrito.objects
            .filter(
                id_carrito_FK__id_usuario_FK=request.user, 
                id_carrito_FK__estatus=True, 
                id_producto_FK__status=True
            )
            .select_related('id_producto_FK')
            .values(
                'id_detalles_carrito_PK', 'cantidad', 'subtotal',
                'id_producto_FK__id_producto_PK', 'id_producto_FK__nombre',
                'id_producto_FK__precio', 'id_producto_FK__imagen', 'id_producto_FK__cantidad'
            )
        )
    else:
        productos_carrito = DetallesCarrito.objects.none()
    
    if request.user.is_authenticated:
        # Calcular total solo con DetallesCarrito cuyos productos siguen activos
        total_activos = DetallesCarrito.objects.filter(
            id_carrito_FK__id_usuario_FK=request.user,
            id_carrito_FK__estatus=True,
            id_producto_FK__status=True
        ).aggregate(Sum('subtotal'))['subtotal__sum'] or 0

        info_carrito = {
            'total_carrito': total_activos,
            'cantidad_elementos': productos_carrito.count()
        }
    else:
        info_carrito = [0, 0]

    if not productos_list:
        respuesta = "No hay productos disponibles"
        return render(request, 'home.html', {"respuesta": respuesta})

    return render(
        request, 'home.html',
        {
        # 'dataApiBcv': dataApiBcv,
        'productos_list': productos_list,
        'categorias': categorias,
        'user': request.user,
        'info_carrito': info_carrito,

        'productos_carrito': productos_carrito
        })

@login_required
@require_POST
def comprar_carrito(request):
    """
    Procesa el formulario de detalles: sólo POST está permitido.
    Si el carrito del usuario está vacío redirige al home.
    """
    # Obtener los productos del carrito del usuario (solo activos)
    productos_carrito = DetallesCarrito.objects.filter(
        id_carrito_FK__id_usuario_FK=request.user,
        id_carrito_FK__estatus=True,
        id_producto_FK__status=True
    )

    # Si no hay productos en el carrito, redirigir al home
    if not productos_carrito.exists():
        return redirect('home:home')

    form = DetallesCarritoForm(request.POST)
    if form.is_valid():
            # Aquí podrías crear la orden en la base de datos usando form.cleaned_data
            # print('--- Nuevo pedido desde modal carrito ---')
            # print('Usuario:', request.user)
            # print('Datos validados:', form.cleaned_data)
            # print('Productos enviados:', productos_carrito)

            # Preparar datos para la vista de confirmación
            datos = form.cleaned_data
            tipo_entrega = datos.get('tipo_entrega')
            metodo_pago = datos.get('metodo_pago')

            # Construir lista legible de productos y totales
            productos_list = []
            total_general = 0
            for det in productos_carrito:
                # det puede ser DetallesCarrito instance o queryset element
                try:
                    prod = det.id_producto_FK
                    nombre = prod.nombre
                    cantidad_det = det.cantidad
                    subtotal = det.subtotal
                except Exception:
                    # valores desde values() (diccionario)
                    nombre = det.get('id_producto_FK__nombre')
                    cantidad_det = det.get('cantidad')
                    subtotal = det.get('subtotal')
                productos_list.append({'nombre': nombre, 'cantidad': cantidad_det, 'subtotal': subtotal})
                total_general += (subtotal or 0)

            # Información de pago específica
            binance_info = {
                'email': 'xavilahur@gmail.com',
                'logo_url': '/static/img/binance-logo.png'
            }

            # Construir mensaje para WhatsApp
            whatsapp_number = '+584163782641'
            msg_lines = []
            msg_lines.append('Nuevo pedido desde la web')
            msg_lines.append(f'Usuario: {request.user}')
            msg_lines.append(f'Nombre: {datos.get("quien") or "-"}')
            msg_lines.append(f'Tipo entrega: {tipo_entrega}')
            msg_lines.append(f'Método pago: {metodo_pago}')
            msg_lines.append('Productos:')
            for p in productos_list:
                msg_lines.append(f"- {p['nombre']} x{p['cantidad']} -> {p.get('subtotal', 0)}")
            msg_lines.append(f'Total: {total_general}')

            # Usar urllib.parse.quote_plus para codificar correctamente el mensaje de WhatsApp
            whatsapp_text = urllib.parse.quote_plus('\n'.join(msg_lines))
            whatsapp_url = f'https://wa.me/{whatsapp_number.replace("+", "")}?text={whatsapp_text}'

            # Guardar pedido y items en la base de datos y decrementar stock dentro de una transacción
            try:
                with transaction.atomic():
                    pedido = Pedido.objects.create(
                        usuario=request.user,
                        quien=datos.get('quien') or '',
                        tipo_entrega=tipo_entrega or '',
                        metodo_pago=metodo_pago or '',
                        total=total_general
                    )

                    # Bloquear y procesar cada detalle del carrito
                    for det in productos_carrito.select_for_update():
                        prod = det.id_producto_FK
                        cantidad_det = det.cantidad
                        subtotal = det.subtotal

                        # Volver a obtener el producto con bloqueo de fila para validar stock
                        producto_locked = Productos.objects.select_for_update().get(pk=prod.pk)
                        if producto_locked.cantidad < cantidad_det:
                            raise ValueError(f"Insufficient stock for product {producto_locked.nombre}")

                        # Crear el item del pedido
                        PedidoItem.objects.create(
                            pedido=pedido,
                            producto=prod,
                            cantidad=cantidad_det,
                            precio_unitario=prod.precio,
                            subtotal=subtotal
                        )

                        # Decrementar stock de forma segura
                        Productos.objects.filter(pk=producto_locked.pk).update(cantidad=F('cantidad') - cantidad_det)
                        # Actualizar status si cantidad queda en 0
                        producto_updated = Productos.objects.get(pk=producto_locked.pk)
                        if producto_updated.cantidad <= 0:
                            producto_updated.status = False
                            producto_updated.save()
            except ValueError as ve:
                # Mostrar error amigable si algún producto no tiene stock suficiente
                return render(request, 'comprar_carrito.html', {
                    'form': form,
                    'productos_carrito': productos_carrito,
                    'errors': {'stock': str(ve)}
                })
            except Exception as e:
                # Registrar y devolver error genérico
                print('Error al crear pedido y decrementar stock:', e)
                return render(request, 'comprar_carrito.html', {
                    'form': form,
                    'productos_carrito': productos_carrito,
                    'errors': {'general': 'Ocurrió un error al procesar su pedido. Intente nuevamente.'}
                })

            # Marcar carrito del usuario como inactivo (cerrado)
            try:
                carrito_obj = Carrito.objects.filter(id_usuario_FK=request.user, estatus=True).first()
                if carrito_obj:
                    carrito_obj.estatus = False
                    carrito_obj.save()
                    # Eliminar detalles relacionados
                    DetallesCarrito.objects.filter(id_carrito_FK=carrito_obj).delete()
            except Exception as e:
                print('Error al cerrar carrito:', e)

            # Renderizar la plantilla de confirmation/compra con contexto enriquecido
            return render(request, 'comprar_carrito.html', {
                'form': form,
                'productos_carrito': productos_carrito,
                'success': True,
                'productos_list': productos_list,
                'total_general': total_general,
                'tipo_entrega': tipo_entrega,
                'metodo_pago': metodo_pago,
                'binance_info': binance_info,
                'whatsapp_url': whatsapp_url,
                'pedido_id': pedido.id_pedido_PK,
            })
    else:
        # Mostrar la plantilla con los errores del formulario (POST inválido)
        # print('--- Error al procesar formulario de compra ---')
        # print('Usuario:', request.user)
        # print('POST:', dict(request.POST))
        # print('Errores:', form.errors)
        return render(request, 'comprar_carrito.html', {
            'form': form,
            'productos_carrito': productos_carrito,
            'errors': form.errors,
        })

@login_required
def generar_nota_entrega(request, pedido_id):
    pedido = Pedido.objects.get(id_pedido_PK=pedido_id)
    # Obtener telefono y direccion desde ClienteProfile si existe
    telefono = ''
    direccion = ''
    try:
        user = pedido.usuario
        profile = getattr(user, 'clienteprofile', None)
        if profile:
            telefono = profile.telefono or ''
            direccion = profile.direccion or ''
    except Exception:
        telefono = ''
        direccion = ''

    context = {
        'pedido': pedido,
        'telefono_cliente': telefono,
        'direccion_cliente': direccion,
    }
    html_string = render_to_string('nota_entrega.html', context)
    # Use wkhtmltopdf via pdfkit
    if PDFKIT_AVAILABLE:
        tried = []
        # If user configured explicit path in settings, try it first
        wkpath = getattr(settings, 'WKHTMLTOPDF_CMD', None)
        if wkpath:
            tried.append(wkpath)
            try:
                cfg = pdfkit.configuration(wkhtmltopdf=wkpath)
                pdf_bytes = pdfkit.from_string(html_string, False, configuration=cfg)
                response = HttpResponse(pdf_bytes, content_type='application/pdf')
                response['Content-Disposition'] = f'attachment; filename="nota_entrega_{pedido_id}.pdf"'
                return response
            except Exception as e:
                print('pdfkit generation error with WKHTMLTOPDF_CMD:', e)

        # Try default PATH
        try:
            pdf_bytes = pdfkit.from_string(html_string, False)
            response = HttpResponse(pdf_bytes, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="nota_entrega_{pedido_id}.pdf"'
            return response
        except Exception as e:
            print('pdfkit default PATH attempt failed:', e)

        # Try common Windows installation paths
        common = [
            r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe',
            r'C:\Program Files (x86)\wkhtmltopdf\bin\wkhtmltopdf.exe'
        ]
        for p in common:
            tried.append(p)
            try:
                cfg = pdfkit.configuration(wkhtmltopdf=p)
                pdf_bytes = pdfkit.from_string(html_string, False, configuration=cfg)
                response = HttpResponse(pdf_bytes, content_type='application/pdf')
                response['Content-Disposition'] = f'attachment; filename="nota_entrega_{pedido_id}.pdf"'
                return response
            except Exception as e:
                print(f'pdfkit generation error trying {p}:', e)

        # None worked
        print('pdfkit generation error: No wkhtmltopdf executable found. Tried:', tried)

    # If pdfkit is not available or failed, return actionable error message
    msg = (
        'PDF generation is not available because wkhtmltopdf was not found. Install wkhtmltopdf (https://wkhtmltopdf.org/) and set WKHTMLTOPDF_CMD in settings if installed in a custom location.\n'
    )
    details = PDFKIT_IMPORT_ERROR or ''
    return HttpResponse(msg + details, content_type='text/plain', status=503)


@login_required
@require_POST
def add_to_cart(request):
    """Recibe POST con 'product_id' y 'cantidad' y añade/actualiza el detalle en el carrito del usuario."""
    try:
        product_id = int(request.POST.get('product_id'))
        cantidad = int(request.POST.get('cantidad', 1))
    except (TypeError, ValueError):
        return JsonResponse({'ok': False, 'error': 'Parametros invalidos'}, status=400)

    # Obtener producto o 404
    producto = get_object_or_404(Productos, id_producto_PK=product_id)

    # Validar existencias: si cantidad en BD es 0, no permitir agregar
    if getattr(producto, 'cantidad', 0) <= 0:
        return JsonResponse({
            'ok': False,
            'error': 'out_of_stock',
            'message': 'Producto sin existencias'
        }, status=400)

    # Validar que la cantidad solicitada no exceda el stock disponible
    if cantidad > getattr(producto, 'cantidad', 0):
        return JsonResponse({
            'ok': False,
            'error': 'insufficient_stock',
            'message': 'Cantidad solicitada mayor al stock disponible',
            'available': producto.cantidad
        }, status=400)

    # Obtener o crear carrito activo para el usuario
    carrito_obj, created = Carrito.objects.get_or_create(id_usuario_FK=request.user, estatus=True, defaults={'total': 0})

    # Buscar detalle existente: si ya existe, no agregamos (solo añadir si no existe)
    detalle = DetallesCarrito.objects.filter(id_carrito_FK=carrito_obj, id_producto_FK=producto).first()
    if detalle:
        # Producto ya está en el carrito: no aumentamos cantidad por ahora
        return JsonResponse({
            'ok': False,
            'error': 'exists',
            'message': 'Producto ya en el carrito',
            'cantidad': detalle.cantidad,
            'available': producto.cantidad
        })
    else:
        subtotal = cantidad * producto.precio
        detalle = DetallesCarrito.objects.create(id_carrito_FK=carrito_obj, id_producto_FK=producto, cantidad=cantidad, subtotal=subtotal)

    # Recalcular total del carrito (solo subtotales de productos activos)
    total = DetallesCarrito.objects.filter(id_carrito_FK=carrito_obj, id_producto_FK__status=True).aggregate(Sum('subtotal'))['subtotal__sum'] or 0
    carrito_obj.total = total
    carrito_obj.save()

    imagen_url = producto.imagen.url if producto.imagen else ''
    return JsonResponse({
        'ok': True,
        'detalle_id': detalle.id_detalles_carrito_PK,
        'producto': {
            'id': producto.id_producto_PK,
            'nombre': producto.nombre,
            'precio': str(producto.precio),
            'imagen': imagen_url,
        },
        'cantidad': detalle.cantidad,
        'total': str(carrito_obj.total)
    })


@login_required
@require_POST
def remove_from_cart(request):
    """Elimina un DetallesCarrito (detalle) por su id y recalcula el total del carrito."""
    try:
        detalle_id = int(request.POST.get('detalle_id'))
    except (TypeError, ValueError):
        return JsonResponse({'ok': False, 'error': 'invalid_id'}, status=400)

    detalle = get_object_or_404(DetallesCarrito, pk=detalle_id)

    # Seguridad: verificar que el detalle pertenece al carrito del usuario
    carrito_obj = detalle.id_carrito_FK
    if carrito_obj.id_usuario_FK != request.user:
        return JsonResponse({'ok': False, 'error': 'forbidden'}, status=403)

    # Borrar el detalle
    detalle.delete()

    # Recalcular total (solo subtotales de productos activos)
    total = DetallesCarrito.objects.filter(id_carrito_FK=carrito_obj, id_producto_FK__status=True).aggregate(Sum('subtotal'))['subtotal__sum'] or 0
    carrito_obj.total = total
    carrito_obj.save()

    return JsonResponse({'ok': True, 'total': str(total)})


@login_required
@require_POST
def update_cart_item(request):
    """Incrementa o decrementa la cantidad de un DetallesCarrito.
    Espera POST con 'detalle_id' y 'action' ('increment'|'decrement').
    Si la cantidad llega a 0 se elimina el detalle.
    Devuelve JSON con cantidad, subtotal y total del carrito.
    """
    try:
        detalle_id = int(request.POST.get('detalle_id'))
    except (TypeError, ValueError):
        return JsonResponse({'ok': False, 'error': 'invalid_id'}, status=400)

    action = request.POST.get('action')
    if action not in ('increment', 'decrement'):
        return JsonResponse({'ok': False, 'error': 'invalid_action'}, status=400)

    detalle = get_object_or_404(DetallesCarrito, pk=detalle_id)
    carrito_obj = detalle.id_carrito_FK
    if carrito_obj.id_usuario_FK != request.user:
        return JsonResponse({'ok': False, 'error': 'forbidden'}, status=403)

    if action == 'increment':
        # Antes de incrementar, validar stock disponible
        producto = detalle.id_producto_FK
        if detalle.cantidad + 1 > getattr(producto, 'cantidad', 0):
            return JsonResponse({
                'ok': False,
                'error': 'insufficient_stock',
                'message': 'No hay suficiente stock para aumentar la cantidad',
                'available': producto.cantidad
            }, status=400)
        detalle.cantidad += 1
        detalle.subtotal = detalle.cantidad * detalle.id_producto_FK.precio
        detalle.save()
        deleted = False
    else:  # decrement
        detalle.cantidad -= 1
        if detalle.cantidad <= 0:
            detalle.delete()
            deleted = True
        else:
            detalle.subtotal = detalle.cantidad * detalle.id_producto_FK.precio
            detalle.save()
            deleted = False

    # Recalcular total del carrito (solo subtotales de productos activos)
    total = DetallesCarrito.objects.filter(id_carrito_FK=carrito_obj, id_producto_FK__status=True).aggregate(Sum('subtotal'))['subtotal__sum'] or 0
    carrito_obj.total = total
    carrito_obj.save()

    if deleted:
        return JsonResponse({'ok': True, 'deleted': True, 'total': str(total)})
    else:
        return JsonResponse({'ok': True, 'deleted': False, 'cantidad': detalle.cantidad, 'subtotal': str(detalle.subtotal), 'total': str(total)})


@require_GET
def search_products(request):
    """Devuelve JSON con productos cuyo nombre contiene la query (case-insensitive)."""
    # Prioridad a búsqueda por categoría si viene el parámetro
    cat = request.GET.get('category')
    q = request.GET.get('q', '').strip()

    if cat is not None and cat != '':
        try:
            cat_id = int(cat)
        except ValueError:
            return JsonResponse({'ok': False, 'error': 'invalid_category'}, status=400)
        if cat_id == 0:
            matches = Productos.objects.filter(status=True)[:40]
        else:
            matches = Productos.objects.filter(categoria__id_categoria_PK=cat_id, status=True)[:40]
    else:
        if not q:
            return JsonResponse({'ok': True, 'results': []})
        matches = Productos.objects.filter(nombre__icontains=q, status=True)[:40]
    data = []
    for p in matches:
        data.append({
            'id': p.id_producto_PK,
            'nombre': p.nombre,
            'descripcion': p.descripcion[:140],
            'precio': str(p.precio),
            'cantidad': p.cantidad,
            'imagen': p.imagen.url if p.imagen else ''
        })
    return JsonResponse({'ok': True, 'results': data})


#madre mia xavier y sus cosas