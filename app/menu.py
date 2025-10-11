def menu_items(request):
    user = request.user
    menu_items = []

    if user.is_authenticated:
        if user.is_superuser or getattr(user, 'rol', '') == 'admin':
            menu_items = [
                {'url': 'home:home', 'label': 'Home'},
                {'url': 'proveedores:proveedores', 'label': 'Proveedores'},
                {'url': 'empleados:gestion_empleados', 'label': 'Empleados'},
                {'url': 'productos:productos', 'label': 'Productos'},
                {'url': 'categorias:categorias', 'label': 'Categorías'},
                {'url': 'clientes:editar_perfil_cliente', 'label': 'Perfil'},
            ]
        elif getattr(user, 'rol', '') == 'empleado' or getattr(user, 'rol', '') == 'vendedor' or getattr(user, 'rol', '') == 'distribuidor':
            menu_items = [
                {'url': 'home:home', 'label': 'Home'},
                {'url': 'proveedores:proveedores', 'label': 'Proveedores'},
                {'url': 'productos:productos', 'label': 'Productos'},
                {'url': 'categorias:categorias', 'label': 'Categorías'},
                {'url': 'clientes:editar_perfil_cliente', 'label': 'Perfil'},
            ]
        elif getattr(user, 'rol', '') == 'cliente':
            menu_items = [{'url': 'home:home', 'label': 'Home'},
                          {'url': 'clientes:editar_perfil_cliente', 'label': 'Perfil'}]
    else:
        menu_items = [
            {'url': 'home:home', 'label': 'Home'},
            {'url': 'login_register:login_register', 'label': 'Login'},
        ]

    return {'menu_items': menu_items}