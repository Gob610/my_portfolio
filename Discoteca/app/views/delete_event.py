"""
Ventana para eliminar evento
"""
import sys
from pathlib import Path
import PySimpleGUI as sg
path_root = Path(__file__).parents[2]
sys.path.append(str(path_root))

from app.controllers.querys import delete_event,delete_mesa,get_mesas
from app.controllers.events_gui import generate_string_to_gui

def create_window_delete_event():
    """
    Funcion para crear la ventana que elimina eventos
    """
    dict_por_fila = generate_string_to_gui()
    print(dict_por_fila)
    fechas = [item["Fecha"] for item in dict_por_fila]

    layout = [
        [sg.Text('CLUB HEAVEN', font=('Arial Bold', 20), justification='center')],
        [sg.Text('Fecha del evento a eliminar:'), sg.Combo(values=fechas, key='combo')],
        [sg.Button('Eliminar Evento')]
    ]
    window_delete_event = sg.Window('Eliminar  Evento', layout)

    while True:
        event, values = window_delete_event.read()
        if event == sg.WINDOW_CLOSED:
            break
        elif event == 'Eliminar Evento':
            fecha_delete = values['combo']
            diccionario_seleccionado = next(item for item in dict_por_fila if item['Fecha'] == fecha_delete)
            id_seleccionado = diccionario_seleccionado['IdEvento']
            # Eliminar todas las mesas y datos relacionados
            mesas = get_mesas(id_seleccionado)
            lista_mesas_ids = mesas['IdMesa'].tolist()
            for mesa in lista_mesas_ids:
                print(delete_mesa(mesa))
            # Eliminar el evento
            print(delete_event(id_seleccionado))
            break

    window_delete_event.close()
