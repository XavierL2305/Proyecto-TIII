from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Proveedores
from .forms import ProveedorForm
from django.contrib.auth.decorators import login_required, user_passes_test

import openpyxl
from openpyxl.styles import Font, Alignment, Border, Side
from openpyxl.drawing.image import Image
from io import BytesIO
from django.http import HttpResponse
import os
from django.conf import settings

def es_empleado(user):
    return user.is_authenticated and user.rol == 'admin' or user.rol == 'empleado'

# Create your views here.
@login_required #validacionn requerida para ingresar a proveedores
@user_passes_test(es_empleado)
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
        request,'pagina/proveedores.html', 
        {
        'proveedores': proveedores, 
        'formulario': formulario,
        'request': request,
        'campos': campos 
        })


def exportar_proveedores_excel(request):
    wb = openpyxl.Workbook()

    # Ruta del logo
    logo_path = os.path.join(settings.BASE_DIR, 'app/static/img/logos/logo_asvg.png')
    if not os.path.exists(logo_path):
        raise FileNotFoundError(f"Logo no encontrado en: {logo_path}")

    ws = wb.active
    ws.title = "Proveedores"

    # Encabezado con nombre empresa y logo
    ws.merge_cells('B1:D1')
    ws['B1'] = "CONTACTOS JLARA"
    ws['B1'].font = Font(size=22, bold=True)
    ws['B1'].alignment = Alignment(horizontal='center', vertical='center')

    img = Image(logo_path)
    img.width = 170
    img.height = 75
    ws.column_dimensions['E'].width = 18
    ws.row_dimensions[1].height = 50
    img.anchor = 'E1'
    ws.add_image(img)

    proveedores = Proveedores.objects.filter(estatus=True).order_by('id_proveedor_PK')
    cantidad_proveedores = proveedores.count()

    ws['A3'] = f"Cantidad de proveedores activos: {cantidad_proveedores}"
    ws['A3'].font = Font(size=14, bold=True)

    # Encabezados de tabla
    headers = ["ID", "Nombre", "Dirección", "Teléfono", "Correo"]
    for col_num, header in enumerate(headers, 1):
        cell = ws.cell(row=5, column=col_num)
        cell.value = header
        cell.font = Font(bold=True, size=13)
        cell.alignment = Alignment(horizontal='center', vertical='center')
        side = Side(border_style='thin', color='000000')
        cell.border = Border(left=side, right=side, top=side, bottom=side)

    # Rellenar datos
    for row_num, proveedor in enumerate(proveedores, start=6):
        valores = [
            proveedor.id_proveedor_PK,
            proveedor.nombre,
            proveedor.direccion,
            proveedor.telefono,
            proveedor.email,
        ]
        for col_num, valor in enumerate(valores, 1):
            cell = ws.cell(row=row_num, column=col_num)
            cell.value = valor
            cell.alignment = Alignment(horizontal='center', vertical='center')
            side = Side(border_style='thin', color='000000')
            cell.border = Border(left=side, right=side, top=side, bottom=side)

    # Ajustar anchos columnas
    ws.column_dimensions['A'].width = 10
    ws.column_dimensions['B'].width = 30
    ws.column_dimensions['C'].width = 60
    ws.column_dimensions['D'].width = 20
    ws.column_dimensions['E'].width = 25
    ws.row_dimensions[5].height = 30
    for row in range(6, 6 + cantidad_proveedores):
        ws.row_dimensions[row].height = 20

    # Preparar respuesta para descarga
    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = 'attachment; filename=proveedores_contacto.xlsx'
    with BytesIO() as b:
        wb.save(b)
        response.write(b.getvalue())

    return response