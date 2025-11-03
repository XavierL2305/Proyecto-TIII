from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model

User = get_user_model()


class PedidosSmokeTests(TestCase):
    def test_pages_require_auth(self):
        resp = self.client.get(reverse('pedidos:pedidos'))
        self.assertIn(resp.status_code, (302, 200))  # redirect to login if not staff
        # mis pedidos should redirect to login for anonymous
        resp2 = self.client.get(reverse('pedidos:consultar_mis_pedidos'))
        self.assertEqual(resp2.status_code, 302)
