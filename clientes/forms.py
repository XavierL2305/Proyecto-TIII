from django import forms
from datetime import date, timedelta
from .models import ClienteProfile

class ClienteProfileForm(forms.ModelForm):
    first_name = forms.CharField(label="Nombre", max_length=30, required=False)
    last_name = forms.CharField(label="Apellido", max_length=30, required=False)
    email = forms.EmailField(label="Correo electrónico", required=False)
    fecha_nacimiento = forms.DateField(
        label="Fecha de nacimiento",
        required=False,
        widget=forms.DateInput(attrs={'type': 'date'}),
        help_text="Selecciona tu fecha de nacimiento. Debes tener al menos 15 años."
    )

    class Meta:
        model = ClienteProfile
        fields = ['telefono', 'direccion', 'fecha_nacimiento', 'first_name', 'last_name', 'email']

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        if user:
            self.fields['first_name'].initial = user.first_name
            self.fields['last_name'].initial = user.last_name
            self.fields['email'].initial = user.email

    def clean_fecha_nacimiento(self):
        fecha = self.cleaned_data.get('fecha_nacimiento')
        if fecha:
            limite = date.today() - timedelta(days=15*365.25)  # 15 años aprox
            if fecha > limite:
                raise forms.ValidationError("Debes tener al menos 15 años para registrarte.")
        return fecha
