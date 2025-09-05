from django import forms
from .models import Categorias

class CategoriasForm(forms.ModelForm):
    class Meta:
        model = Categorias
        fields = ['descripcion', 'status']
