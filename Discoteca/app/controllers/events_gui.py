"""
Funcion para conseguir los eventos que vienen
"""

from datetime import date
from app.controllers.querys import get_events

def generate_string_to_gui():
    """
    Genera el texto para colocar en el evento
    """
    events = get_events()
    fecha_actual = date.today()
    fechas_futuras = events[events['Fecha'] >= fecha_actual]
    dict_por_fila = fechas_futuras.to_dict(orient='records')
    return dict_por_fila
