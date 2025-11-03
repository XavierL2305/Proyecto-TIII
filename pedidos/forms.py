from django import forms


class PedidoFilterForm(forms.Form):
    estado = forms.ChoiceField(required=False, choices=(('', '----'), ('pendiente', 'Pendiente'), ('completado', 'Completado')))
