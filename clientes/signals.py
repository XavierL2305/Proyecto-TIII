from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import ClienteProfile

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def crear_actualizar_perfil_cliente(sender, instance, created, **kwargs):
    if created:
        ClienteProfile.objects.create(user=instance)
    # evita error si perfil no existe (intenta guardar solo si existe)
    else:
        if hasattr(instance, 'clienteprofile'):
            instance.clienteprofile.save()

# Signal para crear o actualizar el perfil del cliente cuando se crea o actualiza un usuario.