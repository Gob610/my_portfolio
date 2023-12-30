"""
Ventana para crear Mesas
"""
import sys
from pathlib import Path

import PySimpleGUI as sg
path_root = Path(__file__).parents[2]
sys.path.append(str(path_root))

from app.controllers.querys import create_mesa

def add_mesa(idevento):
    layout = [
        [sg.Text('CLUB HEAVEN', font=('Arial Bold', 20))],
        [sg.Text('Introduce los datos para crear las mesas')],
        [sg.Text('Capacidad:'),sg.Input(key='-CAPACIDAD-', size=(12,1))],
        [sg.Text('Numero de mesas a crear:'),sg.Input(key='-NUM-', size=(12,1))],
        [sg.Button('Ingresar')]
    ]
    add_mesa_window = sg.Window('CLUB HEAVEN', layout)

    while True:
        event, values = add_mesa_window.read()
        if event == sg.WINDOW_CLOSED:
            break
        if event == 'Ingresar':
            cantidad = int(values['-NUM-'])
            for i in range(cantidad):
                print(create_mesa(values['-CAPACIDAD-'],0,idevento))
            break

    add_mesa_window.close()
