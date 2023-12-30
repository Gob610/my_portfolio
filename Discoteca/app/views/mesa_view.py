"""
Datos de la mesa especifica (cliente,miembros,estado)
  Tambien tendrá opciones de añadir miembro, eliminar
  Editar Cliente
"""

import sys
from pathlib import Path

import PySimpleGUI as sg
path_root = Path(__file__).parents[2]
sys.path.append(str(path_root))

from app.controllers.querys import get_specific_mesa,get_data_mesa
from app.views.add_client import create_window_add_client
from app.views.add_member import create_window_add_member
from app.views.delete_member import window_delete_member
from app.controllers.querys import delete_client_lead, change_status

def create_mesa_view(idmesa):
    """
    Funcion para crear la ventana con data de la mesa
    """
    data = get_specific_mesa(idmesa)
    if data[1].empty is False:
        values_table = data[1].values.tolist()
        _value_client_ = [sg.Table(values=values_table,headings=data[1].columns.tolist(),
                                auto_size_columns=True,max_col_width=35,num_rows=1),sg.Button('Eliminar Cliente')]
    else:
        _value_client_ = [sg.Button('Agregar Cliente')]

    cant_miembros = data[0].shape[0]
    df_mesas_evento = get_data_mesa(idmesa)
    _value_members_ = []

    capacidad_mesa = df_mesas_evento.iloc[0]['Capacidad']
    if cant_miembros != 0:
        values_table_m = data[0].values.tolist()
        _value_members_ = [sg.Table(values=values_table_m,headings=data[0].columns.tolist(),
                            auto_size_columns=True,max_col_width=35,num_rows=10),sg.Button('Eliminar Miembro')]
    if cant_miembros < capacidad_mesa:
        _btn_add_member_ = [sg.Button('Agregar Miembro')]
    else:
        _btn_add_member_ = []


    layout = [
        [sg.Text('CLUB HEAVEN', font=('Arial Bold', 20), justification='center')],
        [sg.Text(f'Mesa Nº{idmesa}')],
        [sg.Text('Cliente:')],
        _value_client_,
        [sg.Text('Miembros:')],
        _value_members_,
        _btn_add_member_
    ]

    mesa_window = sg.Window('CLUB HEAVEN', layout)

    while True:
        event, values = mesa_window.read()
        if event == sg.WINDOW_CLOSED:
            break
        elif event == 'Agregar Cliente':
            create_window_add_client(idmesa)
            break
        elif event == 'Agregar Miembro':
            create_window_add_member(idmesa)
            break
        elif event == 'Eliminar Cliente':
            id_cliente = data[1]['IdCliente'].iloc[0]
            print(delete_client_lead(id_cliente))
            print(change_status(0,idmesa))
            break
        elif event == 'Eliminar Miembro':
            window_delete_member()
            break

    mesa_window.close()
