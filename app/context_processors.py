from .views import get_menu_items

def menu_items(request):
    return {'menu_items': get_menu_items(request.user)}
