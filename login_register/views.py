from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login as auth_login
from django.contrib.auth.views import LogoutView
from django.contrib import messages
from .forms import RegistroForm

def login_register(request):
    if request.method == 'POST':
        if 'register' in request.POST:
            form = RegistroForm(request.POST)
            login_form = AuthenticationForm()
            if form.is_valid():
                form.save()
                messages.success(request, 'Cuenta creada con éxito. Ahora puedes iniciar sesión.')
                return redirect('login_register:login_register')
            else:
                for field, errors in form.errors.items():
                    for error in errors:
                        messages.error(request, f"{error}")
        elif 'login' in request.POST:
            login_form = AuthenticationForm(request, data=request.POST)
            form = RegistroForm()
            if login_form.is_valid():
                user = login_form.get_user()
                auth_login(request, user)
                return redirect('/')  
            else:
                for field, errors in login_form.errors.items():
                    for error in errors:
                        messages.error(request, f"{error}")
        else:
            form = RegistroForm()
            login_form = AuthenticationForm()
    else:
        form = RegistroForm()
        login_form = AuthenticationForm()

    context = {
        'form': form,
        'login_form': login_form,
    }
    return render(request, 'login_register/login_register.html', context)


class CustomLogoutView(LogoutView):
    next_page = '/proveedores'  # redirige a la página de proveedores después de cerrar sesión
