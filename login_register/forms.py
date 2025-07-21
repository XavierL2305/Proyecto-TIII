from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from .models import CustomUser

User = get_user_model()

class RegistroForm(UserCreationForm):
    email = forms.EmailField(
        required=True,
        error_messages={
            'required': 'El correo electrónico es obligatorio.',
            'invalid': 'Introduce un correo electrónico válido.',
        }
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise ValidationError("Este correo electrónico ya está registrado.")
        return email

    def clean_password1(self):
        password1 = self.cleaned_data.get('password1')
        if password1 and len(password1) < 8:
            raise ValidationError("La contraseña es demasiado corta. Debe tener al menos 8 caracteres.")
        return password1

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password1', 'password2', 'rol', 'is_cliente']

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'rol', 'is_cliente']
