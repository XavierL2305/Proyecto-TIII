from django import forms


class DetallesCarritoForm(forms.Form):
	"""Formulario para los detalles de la orden en el modal de carrito.

	Campos:
	- quien: nombre de la persona para el pedido (requerido)
	- tipo_entrega: 'delivery' o 'agencia' (radio, requerido)
	- metodo_pago: 'efectivo', 'zelle', 'binance', 'transferencia' (radio, requerido)
	"""

	ENTREGA_CHOICES = (
		('delivery', 'Delivery'),
		('agencia', 'Envío por agencia'),
	)

	PAGO_CHOICES = (
		('efectivo', 'Efectivo'),
		('zelle', 'Zelle'),
		('binance', 'Binance'),
		('transferencia', 'Transferencia bancaria'),
	)

	quien = forms.CharField(
		label='Nombre',
		max_length=120,
		required=True,
		widget=forms.TextInput(attrs={'placeholder': '', 'id': 'quien'})
	)

	tipo_entrega = forms.ChoiceField(
		label='Tipo de entrega',
		choices=ENTREGA_CHOICES,
		widget=forms.RadioSelect,
		required=True,
	)

	metodo_pago = forms.ChoiceField(
		label='Método de pago',
		choices=PAGO_CHOICES,
		widget=forms.RadioSelect,
		required=True,
	)

	def clean_quien(self):
		quien = self.cleaned_data.get('quien', '').strip()
		if not quien:
			raise forms.ValidationError('El nombre es requerido.')
		# Opcional: validación mínima para evitar nombres con solo números
		if any(char.isdigit() for char in quien):
			# no prohibimos totalmente, solo advertimos en la validación
			raise forms.ValidationError('El nombre no debe contener números.')
		return quien

	def clean_tipo_entrega(self):
		tipo = self.cleaned_data.get('tipo_entrega')
		allowed = {c[0] for c in self.ENTREGA_CHOICES}
		if tipo not in allowed:
			raise forms.ValidationError('Tipo de entrega inválido.')
		return tipo

	def clean_metodo_pago(self):
		metodo = self.cleaned_data.get('metodo_pago')
		allowed = {c[0] for c in self.PAGO_CHOICES}
		if metodo not in allowed:
			raise forms.ValidationError('Método de pago inválido.')
		return metodo
