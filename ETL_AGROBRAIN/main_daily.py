import datetime
from sql_functions import *
from sql_functions import *
from api import connection_api

def run_daily_per_h():
    """
    Este script correrá todos los dias a las 09:30am, 11:30am y 2:30pm
    FUNCION:
        Remigrar los datos del dia de hoy
    """
    # Nombre del archivo:
    file_name = 'historial_daily.txt'
    current_time = datetime.datetime.now()

    # Obtener fecha de hoy y de ayer
    fecha_hoy, fecha_ayer = get_date()

    # Crear la conexion con la base de datos
    engine, session = create_conection()

    try:
        # Eliminar los registros necesarios
        delete_by_dates(engine, fecha_hoy, fecha_hoy)
        
        # Conseguir datos de la api
        response = connection_api(fecha_hoy)
        r = response.json()

        # Subir los datos a la base de datos
        upload(engine, r)
    
        message = f'\nFecha: {fecha_hoy}\n- Hora ejecucion: {current_time}:\tEl archivo se ejecutó correctamente'
        with open(file_name, 'a') as file:
            file.write(message)

    except Exception as e:
        message = f'\nFecha: {fecha_hoy}\n- Hora ejecucion: {current_time}:\tOcurrió un error: {str(e)}'
        with open(file_name,'a') as file:
            file.write(message)


run_daily_per_h()