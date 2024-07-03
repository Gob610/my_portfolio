from sql_functions import *
from sql_functions import *
from api import connection_api

def main():
    """
    Este script correrá todos los dias a las 7:30am
    FUNCION:
        Remigrar la data de ayer y la del dia de hoy
    """
    # Nombre del archivo:
    file_name = 'historial_two_days.txt'
    current_time = datetime.datetime.now()

    try:
        # Obtener fecha de hoy y de ayer
        fecha_hoy, fecha_ayer = get_date()

        # Crear la conexion con la base de datos
        engine, session = create_conection()
            
        # Eliminar los registros necesarios
        delete_by_dates(engine, fecha_ayer, fecha_hoy)
        last_2_f = [fecha_ayer,fecha_hoy]
        try:
            for fecha in last_2_f:
                response = connection_api(fecha)
                r = response.json()
                upload(engine, r)
            messagenice = f'\nFecha: {fecha_hoy}\n- Hora ejecucion: {current_time}:\tEl archivo se ejecutó correctamente'
            with open(file_name, 'a') as file:
                file.write(messagenice)
        except Exception as e:
            messagerrorup = f'\nFecha: {fecha_hoy}\n- Hora ejecucion: {current_time}:\tOcurrió un error al subir la data: {str(e)}'
            with open(file_name, 'a') as file:
                file.write(messagerrorup)

    except Exception as e:
        messagerror = f'\nFecha: {fecha_hoy}\n- Hora ejecucion: {current_time}:\tOcurrió un error: {str(e)}'
        with open(file_name, 'a') as file:
            file.write(messagerror)

if __name__ == "__main__":
    main()