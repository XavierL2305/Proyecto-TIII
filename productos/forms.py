from django import forms
from .models import Productos
from categorias.models import Categorias

class ProductoForm(forms.ModelForm):
    categoria = forms.ModelChoiceField(queryset=Categorias.objects.filter(status=True), required=True, label="Categoría")
    cantidad = forms.IntegerField(min_value=0, label="Cantidad")

    class Meta:
        model = Productos
        fields = ['nombre', 'descripcion', 'precio', 'cantidad' ,'imagen', 'categoria', 'status']
