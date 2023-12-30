"""
Ventana Principal
"""
import sys
from pathlib import Path

import PySimpleGUI as sg
path_root = Path(__file__).parents[2]
sys.path.append(str(path_root))

# Importar los metodos para modificar la DB
from app.views.create_event import create_event_window
from app.views.delete_event import create_window_delete_event
from app.controllers.events_gui import generate_string_to_gui
from app.views.event_view import event_view

sg.theme('DarkBlue13')

def create_main_window():
    """
    Funcion para crear la ventana principal
    """
    dict_por_fila = generate_string_to_gui()
    fechas = [item["Fecha"] for item in dict_por_fila]

    layout = [
        [sg.Text('      CLUB HEAVEN      ', font=('Arial Bold', 20))],
        [sg.Text('EVENTOS:' + ' ' * 35), sg.Button('Actualizar')],
        [sg.Combo(values=fechas, key='combo',size=(15,1)), sg.Text(' '*16), sg.Button('Seleccionar')],
        [sg.Button('Crear Evento'), sg.Text(' '*20), sg.Button('Eliminar Evento')]
    ]
    window = sg.Window('Ventana Principal', layout)

    while True:
        event, values = window.read()
        if event == sg.WINDOW_CLOSED:
            break
        elif event == 'Seleccionar':
            if values['combo'] == '':
                print('Por favor ingresa una fecha')
            else:
                fecha_seleccionada = values['combo']
                diccionario_seleccionado = next(item for item in dict_por_fila if item['Fecha'] == fecha_seleccionada)
                id_seleccionado = diccionario_seleccionado['IdEvento']
                print(f"Seleccionaste la fecha: {fecha_seleccionada}, con el ID: {id_seleccionado}")
                event_view(id_seleccionado)
        elif event == 'Crear Evento':
            create_event_window()
        elif event == 'Actualizar':
            datos_nuevos = generate_string_to_gui()
            nuevas_fechas = [item["Fecha"] for item in datos_nuevos]
            window['combo'].update(values=nuevas_fechas)
        elif event == 'Eliminar Evento':
            create_window_delete_event()

    window.close()
