from django import forms
from .models import Productos
from categorias.models import Categoria

class ProductoForm(forms.ModelForm):
    categoria = forms.ModelChoiceField(queryset=Categoria.objects.filter(status=True), required=True, label="Categoría")

    class Meta:
        model = Productos
        fields = ['nombre', 'descripcion', 'precio', 'imagen', 'categoria', 'status']
