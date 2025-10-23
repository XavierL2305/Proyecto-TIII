from django.shortcuts import render
from django.contrib.auth.decorators import login_required

def get_menu_items(user):
    menu_items = []
    if user.is_superuser:
        menu_items = [
            {'url': 'proveedores:proveedores', 'label': 'Proveedores'},
            {'url': 'empleados:gestion_empleados', 'label': 'Empleados'},
            {'url': 'productos:productos', 'label': 'Productos'},
            {'url': 'pedidos:pedidos', 'label':'Pedidos'},
            {'url': 'categorias:categorias', 'label': 'Categorías'},
        ]
    elif user.groups.filter(name='Empleado').exists():
        menu_items = [
            {'url': 'proveedores:proveedores', 'label': 'Proveedores'},
            {'url': 'productos:productos', 'label': 'Productos'},
            {'url': 'categorias:categorias', 'label': 'Categorías'},
        ]
    elif user.groups.filter(name='Cliente').exists():
        menu_items = [{'url': 'home:home', 'label': 'Home'}]
    
    menu_items.append({'url': 'login_register:login_register', 'label': 'Login'})
    return menu_items
