"""
    FUNCIONES CON LAS QUERYS QUE HARAN TODAS LAS MODIFICACIONES EN LA BASE DE DATOS
"""

from sqlalchemy import create_engine
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
import pandas as pd
import mysql.connector


engine = create_engine('mysql+mysqlconnector://root:admin@localhost/reservas')


def get_specific_mesa(idmesa):
    """
    Devuelve los datos de una mesa y el cliente y los miembros registrados en ella
    """
    conexion = mysql.connector.connect(
        host="localhost",
        user="root",
        password="admin",
        database="reservas"
    )
    cursor = conexion.cursor()

    try:
        cursor.callproc('GetMesaData', args=(idmesa,))

        for result in cursor.stored_results():
            resultado = result.fetchall()
        df1 = pd.DataFrame(resultado, columns=['IdMiembro', 'Nombre_Miembro','DNI','IdMesa', 'Capacidad','Estado','IdEvento'])
        conexion.commit()

        result_cliente = pd.read_sql(f'SELECT * FROM cliente WHERE IdMesa = {idmesa}', con=engine)

        return df1, result_cliente
    except mysql.connector.Error as error:
        print(f"Error al ejecutar el procedimiento almacenado: {error}")
    finally:
        cursor.close()
        conexion.close()


def get_events():
    """
    Devuelve un dataframe con todos los eventos
    """
    answer = pd.read_sql('SELECT * FROM evento', con=engine)
    return answer


def get_data_mesa(idmesa):
    """
    Devuelve la fila de datos de la mesa
    """
    answer = pd.read_sql(f'SELECT * FROM mesas WHERE IdMesa = {idmesa}',con=engine)
    return answer


def get_mesas(idevento):
    """
    Devuelve un dataframe con todas las mesas por evento
    """
    answer = pd.read_sql(f'SELECT * FROM Mesas WHERE IdEvento={idevento}',con=engine)
    return answer


def create_event(fecha):
    """
    Crea un evento
    """
    try:
        query = text(f"INSERT INTO evento (Fecha) VALUES ('{fecha}')")
        with engine.connect() as connection:
            connection.execute(query)
            connection.commit()
        return "¡Evento creado exitosamente!"
    except SQLAlchemyError as e:
        error_msg = f"Error al crear el evento: {str(e)}"
        return error_msg


def create_mesa(_capacidad_,_estado_,_idevento_):
    """
    Crear una mesa
    """
    try:
        query = text(f"INSERT INTO mesas (Capacidad,Estado,IdEvento) VALUES ({_capacidad_},{_estado_},{_idevento_})")
        with engine.connect() as connection:
            connection.execute(query)
            connection.commit()
        return "¡Mesa creada correctamente!"
    except SQLAlchemyError as e:
        error_msg = f'Error al crear la mesa: {str(e)}'
        return error_msg


def change_status(estado, idmesa):
    """
    Cambia el estado de una mesa, de disponible a reservada y viceversa
    """
    try:
        query = text(f'UPDATE mesas SET Estado = {estado} WHERE IdMesa = {idmesa}')
        with engine.connect() as connection:
            connection.execute(query)
            connection.commit()
        return "Se cambio el estado de la mesa"
    except SQLAlchemyError as e:
        error_msg = f'Error al cambiar el estado de la mesa: {str(e)}'
        return error_msg

def register_client_lead(nombre_,dni,celular,idmesa):
    """
    Registra el cliente que reservó la mesa
    """
    try:
        query = text(f'INSERT INTO cliente (Nombre,DNI,Celular,IdMesa) VALUES ("{nombre_}","{dni}","{celular}",{idmesa})')
        with engine.connect() as connection:
            connection.execute(query)
            connection.commit()
        return "Se registró correctamente al cliente lider de mesa"
    except SQLAlchemyError as e:
        error_msg = f'Error al registrar cliente lider de mesa: {str(e)}'
        return error_msg

def register_member(nombre,dni,idmesa):
    """
    Registra un miembro para una mesa ya reservada
    """
    try:
        query = text(f'INSERT INTO miembros (Nombre,DNI,IdMesa) VALUES ("{nombre}","{dni}",{idmesa})')
        with engine.connect() as connection:
            connection.execute(query)
            connection.commit()
        return f"Se registró el miembro para la mesa {idmesa}"
    except SQLAlchemyError as e:
        error_msg = f'Error al registrar miembro en las mesa {idmesa}: {str(e)}'
        return error_msg

def edit_client_lead(nombre,dni,celular,idmesa,idcliente):
    """
    Modificar datos de un cliente lead
    """
    try:
        query = text(f"UPDATE cliente SET nombre = '{nombre}', dni = '{dni}', celular = '{celular}', idmesa = {idmesa} WHERE IdCliente = {idcliente}")
        with engine.connect() as connection:
            connection.execute(query)
            connection.commit()
        return f'Se modificó el registro del cliente con id: {idcliente}'
    except SQLAlchemyError as e:
        error_msg = f'Error al modificar los datos del cliente: {str(e)}'
        return error_msg


def edit_member(nombre,dni,idmesa,idmiembro):
    """
    Editar los datos de un miembro
    """
    try:
        query = text(f"UPDATE miembros SET nombre = '{nombre}', dni = '{dni}', idmesa = {idmesa} WHERE IdMiembro = {idmiembro}")
        with engine.connect() as connection:
            connection.execute(query)
            connection.commit()
        return f'Se modificó el registro del miembro con id: {idmiembro}'
    except SQLAlchemyError as e:
        error_msg = f'Error al modificar los datos del cliente: {str(e)}'
        return error_msg


def edit_capacity(idmesa, capacidad):
    """
    Editar la capacidad de las mesas porque el estado se puede cambiar desde otro metodo
    y el idevento no se puede cambiar
    """
    try:
        query = text(f'UPDATE mesas SET Capacidad = {capacidad} WHERE IdMesa = {idmesa}')
        with engine.connect() as connection:
            connection.execute(query)
            connection.commit()
        return "Capacidad modificada correctamente!"
    except SQLAlchemyError as e:
        error_msg = f'Error al modificar la capacidad: {str(e)}'
        return error_msg


def delete_event(id_evento):
    """
    Elimina un evento
    """
    try:
        query = text(f'DELETE FROM evento WHERE IdEvento={id_evento}')
        with engine.connect() as connection:
            connection.execute(query)
            connection.commit()
        return "¡Evento eliminado correctamente!"
    except SQLAlchemyError as e:
        error_msg = f'Error al eliminar el evento: {str(e)}'
        return error_msg


def delete_client_lead(idcliente):
    """
    Eliminar cliente usando su id
    """
    try:
        query = text(f"DELETE FROM cliente WHERE IdCliente = {idcliente}")
        with engine.connect() as connection:
            connection.execute(query)
            connection.commit()
        return f'Se eliminó el registro del cliente con id: {idcliente}'
    except SQLAlchemyError as e:
        error_msg = f'Error al eliminar los datos del cliente: {str(e)}'
        return error_msg


def delete_member(idmember):
    """
    Eliminar un miembro
    """
    try:
        query = text(f"DELETE FROM miembros WHERE IdMiembro = {idmember}")
        with engine.connect() as connection:
            connection.execute(query)
            connection.commit()
        return f'Se eliminó el registro del cliente con id: {idmember}'
    except SQLAlchemyError as e:
        error_msg = f'Error al eliminar los datos del cliente: {str(e)}'
        return error_msg


def delete_mesa(idmesa):
    """
    Eliminar primero los miembros y client_lead

    IMPORTANTE: PODER ELIMINAR MESAS ASI NO TENGAN CLIENTES
    """
    # Primero necesito saber el client_lead que pertenece a esa mesapara poder borrarlo
    try:
        query = text(f'SELECT IdCliente FROM cliente WHERE IdMesa = {idmesa}')
        query2 = text(f'SELECT IdMiembro FROM miembros WHERE IdMesa = {idmesa}')
        with engine.begin() as connection:
            pre_id_client = connection.execute(query).fetchone()
            if pre_id_client is not None:
                id_client = pre_id_client[0]
                print(delete_client_lead(id_client))
            pre_id_members = connection.execute(query2).fetchall()
            if pre_id_members is not None:
                id_members = [element[0] for element in pre_id_members]
                for member in id_members:
                    print(delete_member(member))
            # Eliminar Mesa
            connection.execute(text(f"DELETE FROM mesas WHERE IdMesa = {idmesa}"))
            connection.commit()
        return "Se logró!"
    except SQLAlchemyError as e:
        error_msg = f'Error: {str(e)}'
        return error_msg
