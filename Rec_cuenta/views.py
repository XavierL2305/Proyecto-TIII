from django.shortcuts import render, redirect
from django.contrib import messages
from django.utils import timezone
from django.urls import reverse
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
from .forms import PasswordResetRequestForm, PasswordResetVerifyForm, SetNewPasswordForm
from .models import PasswordResetToken
import secrets

User = get_user_model()

def password_reset_request(request):
    if request.method == 'POST':
        form = PasswordResetRequestForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                user = None
            if user:
                token = secrets.token_urlsafe(32)
                expires_at = timezone.now() + timezone.timedelta(minutes=30)
                PasswordResetToken.objects.create(user=user, token=token, expires_at=expires_at, used=False)
                reset_url = request.build_absolute_uri(reverse('Rec_cuenta:password_reset_verify') + f'?token={token}')
                subject = 'Restablece tu contraseña'
                message = f'Usa este enlace para restablecer tu contraseña:\n{reset_url}\nCaduca en 30 minutos.'
                send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])
            messages.success(request, 'Si ese correo está registrado, te enviamos instrucciones para restablecer la contraseña.')
            return redirect('Rec_cuenta:password_reset_request')
    else:
        form = PasswordResetRequestForm()
    return render(request, 'Rec_cuenta/password_reset_request.html', {'form': form})

def password_reset_verify(request):
    token = request.GET.get('token', '')
    if request.method == 'POST':
        form = PasswordResetVerifyForm(request.POST)
        if form.is_valid():
            code = form.cleaned_data['code']
            try:
                t = PasswordResetToken.objects.get(token=code, used=False)
            except PasswordResetToken.DoesNotExist:
                messages.error(request, 'Código inválido o ya utilizado.')
                return redirect('Rec_cuenta:password_reset_verify')
            if t.is_expired():
                messages.error(request, 'El código ha expirado.')
                return redirect('Rec_cuenta:password_reset_request')
            t.used = True
            t.save()
            request.session['password_reset_user_id'] = t.user_id
            return redirect('Rec_cuenta:set_new_password')
    else:
        form = PasswordResetVerifyForm()
        if token:
            try:
                t = PasswordResetToken.objects.get(token=token, used=False)
            except PasswordResetToken.DoesNotExist:
                t = None
            if t and not t.is_expired():
                request.session['password_reset_user_id'] = t.user_id
                return redirect('Rec_cuenta:set_new_password')
    return render(request, 'Rec_cuenta/password_reset_verify.html', {'form': form})

def set_new_password(request):
    user_id = request.session.get('password_reset_user_id')
    if not user_id:
        messages.error(request, 'Sesión inválida para restablecer contraseña.')
        return redirect('Rec_cuenta:password_reset_request')
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        messages.error(request, 'Usuario no encontrado.')
        return redirect('Rec_cuenta:password_reset_request')

    if request.method == 'POST':
        form = SetNewPasswordForm(request.POST)
        if form.is_valid():
            new_password = form.cleaned_data['password1']
            user.set_password(new_password)
            user.save()
            del request.session['password_reset_user_id']
            messages.success(request, 'Contraseña actualizada, inicia sesión con la nueva.')
            return redirect('login_register:login_register')
    else:
        form = SetNewPasswordForm()
    return render(request, 'Rec_cuenta/set_new_password.html', {'form': form})
