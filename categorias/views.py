from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Categorias
from .forms import CategoriasForm
from django.contrib.auth.decorators import login_required, user_passes_test

import openpyxl
from openpyxl.styles import Font, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.drawing.image import Image
from io import BytesIO
from django.http import HttpResponse
import os
from django.conf import settings
from .models import Categorias


def es_empleado(user):
    return user.is_authenticated and user.rol == 'admin' or user.rol == 'empleado'

# Create your views here.
@login_required #validacionn requerida para ingresar a proveedores
@user_passes_test(es_empleado)
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


def exportar_categorias_excel(request):
    wb = openpyxl.Workbook()

    # Ruta del logo
    logo_path = os.path.join(settings.BASE_DIR, 'app/static/img/logos/logo_asvg.png')
    if not os.path.exists(logo_path):
        raise FileNotFoundError(f"Logo no encontrado en: {logo_path}")

    # Hoja 1: Categorías Activas
    ws_activas = wb.active
    ws_activas.title = "Categorías Activas"
    ws_activas.merge_cells('B1')
    ws_activas['B1'] = "CONTACTOS JLARA"
    ws_activas['B1'].font = Font(size=22, bold=True)
    ws_activas['B1'].alignment = Alignment(horizontal='center', vertical='center')
    img = Image(logo_path)
    img.width = 100
    img.height = 70
    ws_activas.column_dimensions['C'].width = 18
    ws_activas.row_dimensions[1].height = 50
    img.anchor = 'C1'
    ws_activas.add_image(img)

    activas_qs = Categorias.objects.filter(status=True)
    cantidad_activas = activas_qs.count()
    ws_activas['A3'] = f"Cantidad de categorías activas: {cantidad_activas}"
    ws_activas['A3'].font = Font(size=14, bold=True)

    headers = ["ID", "Descripción", "Estado"]
    for col_num, header in enumerate(headers, 1):
        cell = ws_activas.cell(row=5, column=col_num)
        cell.value = header
        cell.font = Font(bold=True, size=13)
        cell.alignment = Alignment(horizontal='center', vertical='center')
        side = Side(border_style='thin', color='000000')
        cell.border = Border(left=side, right=side, top=side, bottom=side)

    for row_num, cat in enumerate(activas_qs, start=6):
        valores = [cat.id_categoria_PK, cat.descripcion, "Activo"]
        for col_num, valor in enumerate(valores, 1):
            cell = ws_activas.cell(row=row_num, column=col_num)
            cell.value = valor
            cell.alignment = Alignment(horizontal='center', vertical='center')
            side = Side(border_style='thin', color='000000')
            cell.border = Border(left=side, right=side, top=side, bottom=side)

    for col in range(1, len(headers) + 1):
        ws_activas.column_dimensions[get_column_letter(col)].width = 25
    ws_activas.column_dimensions['A'].width = 10
    ws_activas.column_dimensions['B'].width = 50
    ws_activas.column_dimensions['C'].width = 15
    ws_activas.row_dimensions[5].height = 30
    for row in range(6, 6 + cantidad_activas):
        ws_activas.row_dimensions[row].height = 20

    # Hoja 2: Categorías Inactivas
    ws_inactivas = wb.create_sheet(title="Categorías Inactivas")
    ws_inactivas.merge_cells('B1')
    ws_inactivas['B1'] = "CONTACTOS JLARA"
    ws_inactivas['B1'].font = Font(size=22, bold=True)
    ws_inactivas['B1'].alignment = Alignment(horizontal='center', vertical='center')
    img_inactivas = Image(logo_path)
    img_inactivas.width = 100
    img_inactivas.height = 70
    ws_inactivas.column_dimensions['C'].width = 18
    ws_inactivas.row_dimensions[1].height = 50
    img_inactivas.anchor = 'C1'
    ws_inactivas.add_image(img_inactivas)

    inactivas_qs = Categorias.objects.filter(status=False)
    cantidad_inactivas = inactivas_qs.count()
    ws_inactivas['A3'] = f"Cantidad de categorías inactivas: {cantidad_inactivas}"
    ws_inactivas['A3'].font = Font(size=14, bold=True)

    for col_num, header in enumerate(headers, 1):
        cell = ws_inactivas.cell(row=5, column=col_num)
        cell.value = header
        cell.font = Font(bold=True, size=13)
        cell.alignment = Alignment(horizontal='center', vertical='center')
        side = Side(border_style='thin', color='000000')
        cell.border = Border(left=side, right=side, top=side, bottom=side)

    for row_num, cat in enumerate(inactivas_qs, start=6):
        valores = [cat.id_categoria_PK, cat.descripcion, "Eliminado"]
        for col_num, valor in enumerate(valores, 1):
            cell = ws_inactivas.cell(row=row_num, column=col_num)
            cell.value = valor
            cell.alignment = Alignment(horizontal='center', vertical='center')
            side = Side(border_style='thin', color='000000')
            cell.border = Border(left=side, right=side, top=side, bottom=side)

    for col in range(1, len(headers) + 1):
        ws_inactivas.column_dimensions[get_column_letter(col)].width = 25
    ws_inactivas.column_dimensions['A'].width = 10
    ws_inactivas.column_dimensions['B'].width = 50
    ws_inactivas.column_dimensions['C'].width = 15
    ws_inactivas.row_dimensions[5].height = 30
    for row in range(6, 6 + cantidad_inactivas):
        ws_inactivas.row_dimensions[row].height = 20

    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    response['Content-Disposition'] = 'attachment; filename=categorias_contacto.xlsx'
    with BytesIO() as b:
        wb.save(b)
        response.write(b.getvalue())

    return response
