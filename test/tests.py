import unittest
import requests

# Se require previamente levantar el servidor backend

class TestEndpoint(unittest.TestCase):
    def testNumerosContactosExito(self):
        """Verifica si la cantidad sabida de un usuario en concreto es correcta"""
        res = requests.get("http://127.0.0.1:5000/billetera/contactos?minumero=21345")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.json()["contactos"]), 2)

    def testPagarExito(self):
        """Verifica si el endpoint de pago esta trabajando dado los parametros correctos"""
        res = requests.get("http://127.0.0.1:5000/billetera/pagar?minumero=21345&numerodestino=123&valor=100")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["operacion"]["valor"], 100)

    def testHistorial(self):
        """Verifica si el historial de un usuario sabido sin pagos es su saldo"""
        res = requests.get("http://127.0.0.1:5000/billetera/historial?minumero=456")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["saldo"], 300)

    def testContactosExito(self):
        """Verifica si un contacto sabido pertenece a una cuenta"""
        res = requests.get("http://127.0.0.1:5000/billetera/contactos?minumero=123")
        body = res.json()
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(body["contactos"]), 1)
        self.assertEqual(body["contactos"][0]["numero"], "456")

    def testContactosFailed(self):
        """Verifica si falla cuando se le envia un parametro incorrecto al endpoint de /contactos"""
        res = requests.get("http://127.0.0.1:5000/billetera/contactos?minumero=some_number")
        self.assertEqual(res.status_code, 400)
        self.assertIn("error", res.json())

    def testUserNotContact(self):
        """Verifica si el usuario destino de un pago no es contacto de un usuario envia error"""
        res = requests.get("http://127.0.0.1:5000/billetera/pagar?minumero=123&numerodestino=21345&valor=90")
        self.assertEqual(res.status_code, 500)
        self.assertIn("error", res.json())

    def testPagarFailed(self):
        """Verifica si falla cuando el valor enviado supera el saldo de un usuario"""
        res = requests.get("http://127.0.0.1:5000/billetera/pagar?minumero=123&numerodestino=456&valor=9999999")
        self.assertEqual(res.status_code, 500)
        self.assertIn("error", res.json())

if __name__ == '__main__':
    unittest.main()