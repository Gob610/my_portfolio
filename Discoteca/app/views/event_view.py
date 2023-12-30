"""
Ventana del Evento con todas sus mesas seleccionables
"""

import sys
from pathlib import Path

import PySimpleGUI as sg
path_root = Path(__file__).parents[2]
sys.path.append(str(path_root))

from app.controllers.events_gui import generate_string_to_gui
from app.controllers.querys import get_mesas
from app.views.mesa_view import create_mesa_view
from app.views.add_mesa_window import add_mesa

def event_view(idevento):
    """
    Creacion de la ventana del evento
    """
    dict_por_fila = generate_string_to_gui()
    fecha_diccionario_seleccionado = next(item for item in dict_por_fila if item['IdEvento'] == idevento)['Fecha']
    # Obtener las mesas del evento
    df = get_mesas(idevento)
    dict_mesas = df.to_dict(orient='records')

    espacio_botones_mesas = []
    layout = [
        [sg.Text('CLUB HEAVEN', font=('Arial Bold', 20))],
        [sg.Text('Selecciona la mesa')],
        [sg.Button('Crear Mesa')],
        espacio_botones_mesas,
        [sg.Graph((20, 20), (0, 0), (20, 20), key='graph'),sg.Text('Disponible')],
        [sg.Graph((20,20),(0,0),(20,20),key='graph2'),sg.Text('Reservado')]
    ]


    for registro in dict_mesas:
        if registro['Estado'] == 1:
            boton = sg.Button(registro['IdMesa'], key=str(registro['IdMesa']), button_color='#B22222')
        else:
            boton = sg.Button(registro['IdMesa'], key=str(registro['IdMesa']))
        espacio_botones_mesas.append(boton)


    event_window = sg.Window(f'Evento {fecha_diccionario_seleccionado}', layout)

    graph = event_window['graph']
    graph2 = event_window['graph2']
    event_window.finalize()


    graph.draw_rectangle((5, 5), (45, 45), line_color='black', fill_color='#6496C8')
    graph2.draw_rectangle((5,5),(45,45), line_color='black',fill_color='#B22222')

    while True:
        event, values = event_window.read()
        if event == sg.WINDOW_CLOSED:
            break
        elif event in [str(registro['IdMesa']) for registro in dict_mesas]:
            id_mesa_seleccionada = int(event)
            create_mesa_view(id_mesa_seleccionada)
            break
        elif event == 'Crear Mesa':
            add_mesa(idevento)

    event_window.close()
