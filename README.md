----------------------- PROYECTO DE AUTOMATIZACION AGROBRAIN -----------------------

Migracion de datos desde la API de agrobrain hacia la base de datos en SQL Server.

IMPORTANTE: No hacer tantas pruebas seguidas porque al parecer la API tiene limite
de peticiones por hora.

1. Requerimientos
    Siempre trabajar desde el entorno virtual ejecutando: etl-agro/Scripts/activate
    
    Ejecutar los siguientes comandos para obtener las librerias
        
        pip install pyodbc==5.1.0
        
        pip install request==2.31.0
        
        pip install SQLAlchemy==2.0.30
    
    Para verificar las librerias instaladas ejecuta: pip freeze (Estando dentro del
    entorno virtual, de lo contrario instalaras las dependencias en el local)
    
    * El django-environ y environ se usaron al principio cuando se verificaron otros
    posibles caminos de desarrollo. Ya no se usan en el proyecto pero los dejé solo
    por si a caso.

2. Archivos 
    
    api.py - Es donde se ejecuta la conexion con la API a traves de la libreria request
    
    sql_functions.py - Tiene todas las funciones de conexion a la base de datos, get
                    de fechas, delete de registros en la base de datos, upload en la BD y
                    una funcion checkdata que es para pruebas y verificar la conexion con
                    la base de datos.
    
    ** El proyecto no debía dividirse con estos nombres "main" porque basicamente no tiene
    ningun archivo principal. Sin embargo, se hizo para satisfacer los requerimientos en
    cuanto al horario de ejecucion. Se dividió en 3 scripts ejecutables:
    
    Basicamente los 3 main funcionan asi: Obtiene la fecha y hora para el historial,
    hace la conexion con la DB, elimina los registros, consigue los datos de la API por dia
    y va subiendo por dia los datos a la DB. Luego registra el funcionamiento en un .txt
    para cada main.
    
        main_week.py - Este script se ejecuta todos los martes a las 4:00am (11:00am en 
                    esta VM).
    
        main.py - Este script se ejecuta todos los dias menos los martes porque sería
                    redundante. Horario: 7:30am (14:30pm en esta VM)
    
        main_daily.py - Este script se ejecuta todos los dias a las 9:30am, 11:30am y
                    2:30pm (16:30pm, 18:30pm y 21:30pm respectivamente en esta VM)
    
    Los archivos txt de historial, quedan para que se registre las ejecuciones del
    proyecto. En caso se vaya la luz o algo pase, ya sabemos cuando se ejecutó y a que
    si hubieron errores.

3. .BAT
    
    El proyecto está dividido en 3 ejecutables .bat, uno por cada archivo main. Estos
    archivos utilizan la consola para activar el entorno virtual y asi poder usar las
    dependencias que necesita el proyecto. Caso contrario, el programador de tareas
    no puede ejecutar los scripts, apareciendo un error (0x1) en la ejecucion.

4. Programador de tareas
    
    Abriendo el Programador de tareas desde windows puedes observar las tareas dando
    click en la parte izquierda donde dice "Biblioteca del Programador de tareas".
    Las tareas de este proyecto tienen por nombre: Migracion_daily(main_daily.py),
    Migracion_dos_dias(main.py) y Migracion_week(main_week.py). Si le das click
    a alguna tarea, abriras las opciones y puedes modificar horario, acciones,
    permisos, etc. Si cambias algo te pedira usuario y contraseña