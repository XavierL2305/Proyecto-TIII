from django import forms
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()

class PasswordResetRequestForm(forms.Form):
    email = forms.EmailField(label='Correo')

    def clean_email(self):
        email = self.cleaned_data['email']
        # Para seguridad, no revelar si el correo existe o no
        return email

class PasswordResetVerifyForm(forms.Form):
    code = forms.CharField(label='Código de verificación', max_length=64)

class SetNewPasswordForm(forms.Form):
    password1 = forms.CharField(label='Nueva contraseña', widget=forms.PasswordInput, min_length=8)
    password2 = forms.CharField(label='Confirmar contraseña', widget=forms.PasswordInput)

    def clean(self):
        cleaned = super().clean()
        if cleaned.get('password1') != cleaned.get('password2'):
            raise ValidationError('Las contraseñas no coinciden.')
        return cleaned