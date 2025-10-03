import requests

def obtener_dolar_bcv():
    url = 'https://bcv-api.rafnixg.dev/rates'  # Puedes cambiarla por otra API que permita CORS
    try:
        response = requests.get(url)
        response.raise_for_status()  # Lanza excepción si hay error HTTP
        data = response.json()
        return data  # O guarda todo el JSON si lo necesitas
    except requests.RequestException as e:
        print(f"Error al obtener el dólar BCV: {e}")
        return "No disponible"  # Manejo de errores, puedes personalizarlo
dataApiBcv = obtener_dolar_bcv()