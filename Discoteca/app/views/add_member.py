"""
Pestaña para ingresar los datos del miembro
"""

import sys
from pathlib import Path

import PySimpleGUI as sg
path_root = Path(__file__).parents[2]
sys.path.append(str(path_root))

from app.controllers.querys import register_member

def create_window_add_member(idmesa):
    """
    Funcion para crear la ventana donde se ingresaran los datos
    """
    layout = [
        [sg.Text('CLUB HEAVEN', font=('Arial Bold', 20), justification='center')],
        [sg.Text('Ingresar Datos del Miembro')],
        [sg.Text('Nombre:'),sg.Input(key='-NOMBRE-')],
        [sg.Text('Dni:'),sg.Input(key='-DNI-')],
        [sg.Button('Registrar Miembro')]
    ]

    add_member_window = sg.Window('CLUB HEAVEN', layout)

    while True:
        event, values = add_member_window.read()
        if event == sg.WINDOW_CLOSED:
            break
        elif event == 'Registrar Miembro':
            print(register_member(values['-NOMBRE-'],values['-DNI-'],idmesa))
            break

    add_member_window.close()