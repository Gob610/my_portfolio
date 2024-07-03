from sql_functions import *
from sql_functions import *
from api import connection_api

def run_weekly():
    """
    Este script correrá todos los martes a las 4:00am
    FUNCION:
        Remigrar la data de toda la semana
    """
    # Nombre del archivo:
    file_name = 'historial_week.txt'
    current_time = datetime.datetime.now()

    try:
        # Obtener fecha de hoy y de ayer
        fecha_hoy, fecha_ayer, fecha_two_b, fecha_three_b, fecha_four_b, fecha_five_b, fecha_six_b, fecha_seven_b = get_week()

        # Crear la conexion con la base de datos
        engine, session = create_conection()
        
        # Eliminar los registros necesarios
        delete_by_dates(engine, fecha_seven_b, fecha_hoy)
        last_7_f = [fecha_seven_b,fecha_six_b,fecha_five_b,fecha_four_b,fecha_three_b,fecha_two_b,fecha_ayer,fecha_hoy]
        for fecha in last_7_f:
            response = connection_api(fecha)
            r = response.json()
            upload(engine, r)

        # Mensaje para historial
        message = f'\nFecha: {fecha_hoy}\n- Hora ejecucion: {current_time}:\tEl archivo se ejecutó correctamente'
        with open(file_name, 'a') as file:
            file.write(message)
    except Exception as e:
        message = f'\nFecha: {fecha_hoy}\n- Hora ejecucion: {current_time}:\tOcurrió un error: {str(e)}'
        with open(file_name, 'a') as file:
            file.write(message)

run_weekly()