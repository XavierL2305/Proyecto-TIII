from django import forms
from .models import ClienteProfile

class ClienteProfileForm(forms.ModelForm):
    class Meta:
        model = ClienteProfile
        fields = ['telefono', 'direccion']
