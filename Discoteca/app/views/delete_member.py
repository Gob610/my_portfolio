"""
Ventana para eliminar miembro
"""
import sys
from pathlib import Path
import PySimpleGUI as sg
path_root = Path(__file__).parents[2]
sys.path.append(str(path_root))

from app.controllers.querys import delete_member

def window_delete_member():
    """
    Funcion para crear la ventana que elimina miembros
    """

    layout = [
        [sg.Text('CLUB HEAVEN', font=('Arial Bold', 20), justification='center')],
        [sg.Text('Id del miembro a eliminar:'), sg.Input(key='-IDMIEMBRO-')],
        [sg.Button('Eliminar Evento')]
    ]
    window_del_mem = sg.Window('Eliminar  Evento', layout)

    while True:
        event, values = window_del_mem.read()
        if event == sg.WINDOW_CLOSED:
            break
        if event == 'Eliminar Evento':
            idmiembro = values['-IDMIEMBRO-']
            print(delete_member(int(idmiembro)))
            break

    window_del_mem.close()
