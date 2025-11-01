from django.conf import settings
from django.core.mail.backends.smtp import EmailBackend

class CustomEmailBackend(EmailBackend):
    """
    Backend SMTP personalizado que omite parámetros keyfile/certfile en starttls()
    para evitar errores en Python 3.12 con Django 3.2.8.
    """

    def open(self):
        if self.connection:
            return False
        self.connection = self.connection_class(self.host, self.port, timeout=self.timeout)

        try:
            self.connection.ehlo()
            if self.use_tls:
                # NOTA: Aquí no se pasan parámetros a starttls para evitar error
                self.connection.starttls()
                self.connection.ehlo()
            if self.username and self.password:
                self.connection.login(self.username, self.password)
            return True
        except Exception:
            if self.connection:
                try:
                    self.connection.quit()
                except Exception:
                    pass
                self.connection = None
            if not self.fail_silently:
                raise
            return False