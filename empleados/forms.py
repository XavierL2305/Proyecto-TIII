from django import forms
from django.contrib.auth import get_user_model

User = get_user_model()

class EmpleadoCreationForm(forms.ModelForm):
    password1 = forms.CharField(label='Contraseña', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Confirmar Contraseña', widget=forms.PasswordInput)

    class Meta:
        model = User
        # Eliminamos 'is_cliente' para que no aparezca en el formulario
        fields = ['username', 'email', 'rol']

    def clean_password2(self):
        p1 = self.cleaned_data.get('password1')
        p2 = self.cleaned_data.get('password2')
        if p1 and p2 and p1 != p2:
            raise forms.ValidationError("Las contraseñas no coinciden.")
        return p2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password1'])
        user.is_cliente = False  # Aseguramos que es empleado, no cliente
        if commit:
            user.save()
        return user


class EmpleadoChangeForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'rol']  # Sin 'is_cliente'

    def save(self, commit=True):
        user = super().save(commit=False)
        # Por seguridad, también aquí forzamos is_cliente=False
        user.is_cliente = False
        if commit:
            user.save()
        return user
