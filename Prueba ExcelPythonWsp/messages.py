
import datetime
from datetime import date
from dateutil.relativedelta import relativedelta
import pywhatkit
import pandas as pd
import PySimpleGUI as sg

def cargar_datos():
    df = pd.read_excel('pagos.xlsx', header=None, index_col=None)
    df.drop(columns=df.columns[0], index=df.index[0], inplace=True)
    etiquetas = df.iloc[0,:].tolist()
    df.columns = etiquetas
    df.drop(index=df.index[0], inplace=True)
    df.reset_index(drop=True, inplace=True)
    # Formatear las fechas sin hora
    for index, value in df['Dia_Inscripcion'].items():
        value = value.strftime('%Y-%m-%d')
        df['Dia_Inscripcion'].iloc[index] = value

    for index, value in df['Prox_dia_pago'].items():
        value = value.strftime('%Y-%m-%d')
        df['Prox_dia_pago'].iloc[index] = value
    return df

def obtener_filas_coincidentes(df, fecha_hoy):
    return df[df['Prox_dia_pago'] == fecha_hoy].index

def crear_ventana(values_dates,df,filas_coincidentes):
    layout = [  [sg.Text('Estos son los clientes que deben pagar hoy:')],
                [sg.Text(df.iloc[filas_coincidentes])],
                [sg.Text('Selecciona el Id del cliente:'),sg.Combo(values_dates, key='combo_element')],
                [sg.Button('Enviar Mensaje'),sg.Button('Cuenta saldada')]]
    return sg.Window('Cobros', layout)

def msg_wsp(df,valor_seleccionado):
    hour_now = int(datetime.datetime.now().strftime('%H'))
    minutes_now = int(datetime.datetime.now().strftime('%M'))
    fila = df.loc[df['Id_Venta'] == valor_seleccionado]
    numero = str(fila['Celular'])
    numero = '+51'+numero[6:]
    return pywhatkit.sendwhatmsg(numero,'Mensaje desde python',hour_now,int(minutes_now)+2)

def cambiar_fecha(fecha):
    fecha_date = date.fromisoformat(fecha)
    nueva_fecha = fecha_date + relativedelta(months=1)
    return nueva_fecha

def main():
    sg.theme('DarkAmber')
    df = cargar_datos()
    fecha_hoy = datetime.date.today().strftime('%Y-%m-%d')
    filas_coincidentes = obtener_filas_coincidentes(df, fecha_hoy)
    values_dates = df['Id_Venta'].iloc[filas_coincidentes].tolist()
    window = crear_ventana(values_dates,df,filas_coincidentes)

    while True:
        event, values = window.read()
        if event == sg.WIN_CLOSED:
            df.to_excel('actualizado.xlsx', index=False)
            break
        if event == 'Enviar Mensaje':
            valor_seleccionado = values['combo_element']
            sg.popup('Se abrirá el navegador para enviar el mensaje cuando cierres esta ventana emergente')
            msg_wsp(df,valor_seleccionado)
        if event == 'Cuenta saldada':
            valor_seleccionado = values['combo_element']
            fila = df['Id_Venta'] == valor_seleccionado
            df.loc[fila, 'Prox_dia_pago'] = df.loc[fila,'Prox_dia_pago'].apply(cambiar_fecha)
    window.close()

if __name__ == "__main__":
    main()
