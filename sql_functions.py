from sqlalchemy import create_engine, MetaData, Table, select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text
import datetime


def get_date():
	hoy = datetime.date.today()
	ayer = hoy - datetime.timedelta(days=1)
	# Dando formato a las fechas
	fecha_hoy = hoy.strftime('%Y-%m-%d')
	fecha_ayer = ayer.strftime('%Y-%m-%d')
	return fecha_hoy, fecha_ayer

def get_week():
    hoy = datetime.date.today()  # No usar hoy
    ayer = hoy - datetime.timedelta(days=1)
    two_bef = hoy - datetime.timedelta(days=2)
    three_bef = hoy - datetime.timedelta(days=3)
    four_bef = hoy - datetime.timedelta(days=4)
    five_bef = hoy - datetime.timedelta(days=5)
    six_bef = hoy - datetime.timedelta(days=6)
    seven_bef = hoy - datetime.timedelta(days=7)

	# Dando formato a las fechas
    fecha_hoy = hoy.strftime('%Y-%m-%d')
    fecha_ayer = ayer.strftime('%Y-%m-%d')
    fecha_two_b = two_bef.strftime('%Y-%m-%d')
    fecha_three_b = three_bef.strftime('%Y-%m-%d')
    fecha_four_b = four_bef.strftime('%Y-%m-%d')
    fecha_five_b = five_bef.strftime('%Y-%m-%d')
    fecha_six_b = six_bef.strftime('%Y-%m-%d')
    fecha_seven_b = seven_bef.strftime('%Y-%m-%d')

    return fecha_hoy, fecha_ayer, fecha_two_b, fecha_three_b, fecha_four_b, fecha_five_b, fecha_six_b, fecha_seven_b

def create_conection():
    server = '---'
    database = '---'
    username = '---'
    password = '---'
    driver = 'ODBC Driver 17 for SQL Server'

    connection_string = f'mssql+pyodbc://{username}:{password}@{server}/{database}?driver={driver}'

    engine = create_engine(connection_string)

    Session = sessionmaker(bind=engine)
    session = Session()
    return engine, session


def delete_by_dates(engine, first_date, last_date):
    # Las fechas deben estar en formato "YYYY-MM-DD"       !!!IMPORTANTE
    with engine.connect().execution_options(isolation_level="AUTOCOMMIT") as connection:
        try:
            connection.execute(text(f"DELETE FROM consumo_datosagrobrain0 WHERE FechaRegistro >= '{str(first_date)} 00:00:00' and FechaRegistro <= '{str(last_date)} 23:59:59';"))
            print(f'Registros de dias: {str(first_date)} hasta {str(last_date)} eliminados correctamente')
        except Exception as e:
            print(f'Error: {str(e)}')
            connection.rollback()


def upload(engine, data):
    metadata = MetaData()
    consumo_datosagrobrain0 = Table('consumo_datosagrobrain0', metadata, autoload_with=engine)
    try:
        with engine.connect() as conn:
            for d in data:
                try:
                    ins = consumo_datosagrobrain0.insert().values(
                        FechaRegistro=d['FechaRegistro'],
                        Latitud=d['Latitud'],
                        Longitud=d['Longitud'],
                        Evaluador=d['Evaluador'],
                        Fundo=d['Fundo'],
                        Modulo=d['Modulo'],
                        Turno=d['Turno'],
                        Campania=d['Campania'],
                        Lote=d['Lote'],
                        Cartilla=d['Cartilla'],
                        TipoGrupoVariable=d['TipoGrupoVariable'],
                        GrupoVariable=d['GrupoVariable'],
                        Variable=d['Variable'],
                        TipoDato=d['TipoDato'],
                        Valor=d['Valor'],
                        Umbral=d['Umbral'],
                        UmbralMinimo=d['UmbralMinimo'],
                        UmbralMaximo=d['UmbralMaximo']
                    )
                    conn.execute(ins)
                    conn.commit()
                except KeyError as e:
                    print("Falta un campo necesario en los datos:", e)
                except Exception as e:
                    print("Error al cargar datos:", e)
    except Exception as e:
        print('Error al conectar con la base de datos:', e)
    print('Se subió la data correctamente')


def check_data(engine):
    metadata = MetaData()
    user_table = Table('consumo_datosagrobrain0',metadata,autoload_with=engine)
    stmt = select(user_table).where(user_table.c.FechaRegistro>='2023-08-02 00:00:00')
    with engine.connect() as conn:
        for row in conn.execute(stmt):
            print(row)