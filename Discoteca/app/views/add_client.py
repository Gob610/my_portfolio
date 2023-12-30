"""
Pestaña para ingresar los datos del cliente y asi reservar una mesa
"""

import sys
from pathlib import Path

import PySimpleGUI as sg
path_root = Path(__file__).parents[2]
sys.path.append(str(path_root))

from app.controllers.querys import register_client_lead,change_status

def create_window_add_client(idmesa):
    """
    Funcion para crear la ventana donde se ingresaran los datos
    """
    layout = [
        [sg.Text('CLUB HEAVEN', font=('Arial Bold', 20), justification='center')],
        [sg.Text('Ingresar Datos del Cliente')],
        [sg.Text('Nombre:'),sg.Input(key='-NOMBRE-')],
        [sg.Text('Dni:'),sg.Input(key='-DNI-')],
        [sg.Text('Celular:'),sg.Input(key='-CEL-')],
        [sg.Button('Registrar Cliente')]
    ]

    add_client_window = sg.Window('CLUB HEAVEN', layout)

    while True:
        event, values = add_client_window.read()
        if event == sg.WINDOW_CLOSED:
            break
        elif event == 'Registrar Cliente':
            print(register_client_lead(values['-NOMBRE-'],values['-DNI-'],values['-CEL-'],idmesa))
            # Cambiar el estado de la mesa a reservado
            print(change_status(1, idmesa))
            break

    add_client_window.close()
