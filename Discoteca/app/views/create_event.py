"""
Ventana para crear evento
"""
import sys
from pathlib import Path
import PySimpleGUI as sg
path_root = Path(__file__).parents[2]
sys.path.append(str(path_root))

from app.controllers.querys import create_event

def create_event_window():
    """
    Funcion para crear la ventan que crea eventos
    """
    layout = [
        [sg.Text('CLUB HEAVEN', font=('Arial Bold', 20), justification='center')],
        [sg.CalendarButton('Seleccionar Fecha',target='-IN-',format='20%y-%m-%d')],
        [sg.Text('Fecha del nuevo evento:'), sg.Input(key='-IN-', size=(12,1))],
        [sg.Button('Crear Evento')]
    ]
    new_event_window = sg.Window('Crear Evento', layout)

    while True:
        event, values = new_event_window.read()
        if event == sg.WINDOW_CLOSED:
            break
        elif event == 'Crear Evento':
            fecha = values['-IN-']
            if fecha is not None:
                print(create_event(fecha))
            break

    new_event_window.close()
