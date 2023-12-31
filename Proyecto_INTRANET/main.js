const express = require('express')
const { spawn, exec } = require('child_process');
const app = express()
app.use(express.urlencoded({ extended:false}))
app.use(express.json())
const session = require('express-session')
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
const dotenv = require('dotenv')
dotenv.config({path:'./env/.env'})
const {join, resolve} = require('path')
const connection = require('./database/db.js');
const { name } = require('ejs');
const { rejects } = require('assert')
app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(join(__dirname, 'public')))
app.use((req, res, next) => {
    res.locals.horaActual = obtenerHoraActual()
    res.locals.fechaActual = obtenerFechaActual()
    next()
});
function obtenerHoraActual() {
    const fechaHoraActual = new Date()
    return fechaHoraActual.toLocaleTimeString()
}
function obtenerFechaActual() {
    const fechaActual = new Date()
    const dia = fechaActual.getDate()
    const mes = fechaActual.getMonth() + 1
    const anio = fechaActual.getFullYear()
    return `${anio}-${mes}-${dia}`
}
// Ruta de pagina de Logeo
app.get('/',(req,res)=>{
    res.render('index')
})
// Autenticación de inicio de sesión 
app.post('/auth', async (req, res)=>{
    const user = req.body.user
    const pass = req.body.pass
    if(user && pass){
        connection.query('CALL SP_datos_usuario(?)', [user], async (err, results)=>{
            // Guardando los datos de usuario al iniciar sesión
            req.session.cod = results[0][0].ID
            req.session.pass = results[0][0].CONTRA
            req.session.name =results[0][0].NOMBRES +' '+ results[0][0].APELLIDOS
            req.session.type = results[0][0]['ID TIPO']
            // validando datos de sesión
            if (results.length == 0 || !(await pass == req.session.pass)){
                res.render('index',{
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario o Contraseña incorrecta",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false,
                    ruta: ''
                })
            } else {
                if(req.session.type == 1){
                    ruta = 'maine'
                    req.session.grado = results[0][0].GRADO
                    req.session.seccion = results[0][0]['SECCIÓN']
                    req.session.idaula = results[0][0]['ID AULA']
                } else if(req.session.type == 2){
                    ruta = 'mainp'
                    req.session.seccion = 0
                } else{
                    ruta = 'maind'
                    req.session.seccion = 0
                }
                req.session.loggedin = true
                res.render('index', {
                    alert: true,
                    alertTitle: "Conexion exitosa",
                    alertMessage: "Ingreso correcto",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: `${ruta}`
                })
            }
        })
    } else {
        res.render('index', {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "Coloca tus datos",
            alertIcon: "warning",
            showConfirmButton: true,
            timer: false,
            ruta: ''
        })
    }
})
// Verificación de sesión de cada página - estudiante
app.get('/maine', async (req, res) => {
    if(req.session.loggedin && req.session.type == 1){
        const getAnuncios = () => {
            return new Promise((resolve, reject) => {
                connection.query('CALL SP_eva_salon(?)', [req.session.idaula], (err, results) => {
                    if (err){
                        reject(err)
                    } else{
                        req.session.tareas = results
                        console.log(results[0][0])
                        console.log(results[1][0])
                        resolve(results)
                    }
                })
            })
        }
        const getCursos = () => {
            return new Promise((resolve, rejects) => {
                connection.query('CALL SP_cursos_estudiante(?)', [req.session.idaula], (err, results) => {
                    if (err){
                        reject(err)
                    } else{
                        req.session.cursos = results[0]
                        resolve(results)
                    }   
                })
            })
        }
        try {
            const anuncios = await getAnuncios()
            const cursos = await getCursos()
            res.render('index-e',{
                login: true,
                horaActual: res.locals.horaActual,
                fechaActual: res.locals.fechaActual,
                name: req.session.name,
                data: req.session.cursos,
                seccion: req.session.seccion,
                tareas: req.session.tareas
            })
        } catch (err) {
            console.log(err)
        } 
    }else{
        res.render('index-e',{
            login: false,
            name: 'Debe iniciar sessión'
        })
    }
})

app.get('/maind', (req, res) => {
    if(req.session.loggedin && req.session.type == 3){
        const pythonProcess = spawn('python', ['./public/python/general_mean.py']);
        pythonProcess.stderr.on('data', (data) => {
            console.log(`Python script error: ${data}`);
        });
        pythonProcess.on('close', (code) => {
            // Renderizar
            res.render('index-d',{
                login: true,
                name: req.session.name,
                seccion: req.session.seccion
            })
        })
    }else{
        res.render('index-d',{
            login: false,
            name: 'Debe iniciar sessión'
        })
    }
})

// Verificación Asignaturas
app.post('/asignatura', async (req, res) => {
    const botonSeleccionado = Object.keys(req.body).find(key => key.startsWith('asignatura_'))
    const idAsignatura = botonSeleccionado.replace('asignatura_', '')
    connection.query('CALL SP_obtener_informacion_curso(?)', [parseInt(idAsignatura)], (err, results) => {
        req.session.curprof = parseInt(idAsignatura)
        req.session.profesor = results[0][0].PROFESOR
        req.session.descurso = results[0][0].DESCRIPCION_ASIGNATURA
        req.session.diashor = results[0]
        res.redirect('/asig-estu')
    })
})

//PROCEDIMIENTO PARA DIRECTORA MAIN
app.post('/acciondesempeno', async(req,res) => {
    const btnAlumnado = Object.keys(req.body);
    const tipoBtn = btnAlumnado.join('');
    if(tipoBtn == 'btnAlumnado'){
        res.redirect('/d-alum-g')
    }else if (tipoBtn == 'btnDocente'){
        res.redirect('/d-doce-c')
    }
})
//PROCEDIMIENTO DIRECTORA -> DESEMPEÑO ALUMNADO
app.get('/d-alum-g', (req,res) => {
    if(req.session.loggedin && req.session.type==3){
        res.render('d-alum-g', {
            login: true,
            name: req.session.name,
            seccion: req.session.seccion
        })
    }else {
        res.render('d-alum-g', {
            login: false,
            name: 'Debe iniciar sessión'
        })
    }
})

//PROCEDIMIENTO DIRECTORA -> DESEMPEÑO DOCENTE
app.get('/d-doce-c', (req,res) => {
    if(req.session.loggedin && req.session.type == 3){
        connection.query('CALL SP_prom_cursos()', (err, results) => {
            const resultados = JSON.stringify(results[0]);

            const docenteMainProcess = spawn('python', ['./public/python/docente_main.py'])
            docenteMainProcess.stdin.write(resultados);
            docenteMainProcess.stdin.end();

            docenteMainProcess.stdout.on('data', (data) => {
                console.log(`Este es el proceso bueno: ${data}`)
            })
            docenteMainProcess.stderr.on('data',(data) => {
                console.log(`grado_prom script error: ${data}`)
            })
            docenteMainProcess.on('close', (code) => {
                res.render('d-doce-c',{
                    login:true,
                    name:req.session.name,
                    seccion: req.session.seccion
                })
            })

        })

    }else{
        res.render('d-doce-c',{
            login:false,
            name: 'Debe iniciar sessión'
        })
    }
})
//PROCEDIMIENTO BOTONES ALUMNADO GRADO->SECCION
app.post('/desempenoalumnado', async(req,res) => {
    const nameBtn = Object.keys(req.body);
    const gradoDato = parseInt(nameBtn)
    req.session.gradoSeleccionado = gradoDato
    

    connection.query('CALL SP_obtener_notas_grado(?)', [gradoDato], (err, results) => {
        // Guardando los resultados
        const resultados = results[0];
        //Convirtiendo los datos en formato para python
        const datosPython = JSON.stringify(resultados);

        const gradoPromProcess = spawn('python', ['./public/python/grado_prom.py'])
        gradoPromProcess.stdin.write(datosPython);
        gradoPromProcess.stdin.end();

        gradoPromProcess.stdout.on('data', (data) => {
            const estadistica = JSON.parse(data.toString())
            req.session.estadistica = estadistica
            console.log('Estadistica es:', estadistica)
        })
        gradoPromProcess.stderr.on('data',(data) => {
            console.log(`grado_prom script error: ${data}`)
        })
        gradoPromProcess.on('close', (code) => {
            // Renderizar
            res.redirect('/d-alum-s')
        })
    })
})
app.post('/doce-curso-seccion', async(req,res) => {
    const nameBtn = Object.keys(req.body);
    connection.query('CALL SP_prom_asignatura(?)', [parseInt(nameBtn)], (err, results) => {
        const datosPython = JSON.stringify(results[0]);
        req.session.docentes = [...new Set(results[0].map(obj => obj.PROFESOR))].sort();

        const asigPromProcess = spawn('python', ['./public/python/doce_asig.py'])
        asigPromProcess.stdin.write(datosPython);
        asigPromProcess.stdin.end();


        asigPromProcess.stdout.on('data', (data) => {
            const estadistica = JSON.parse(data.toString())
            req.session.doceAsigEstadistica = estadistica
            console.log('Estadistica es:', estadistica)
        })
        asigPromProcess.stderr.on('data',(data) => {
            console.log(`doce_asig.py script error: ${data}`)
        })
        asigPromProcess.on('close', (code) => {
            // Renderizar
            res.redirect('d-doce-d')
        })

    })
})


// Renderizar página de asignatura
app.get('/asig-estu', (req,res) => {
    if(req.session.loggedin && req.session.type == 1){
        res.render('e-asig',{
            login: true,
            name: req.session.name,
            nomasig: req.session.descurso,
            prof: req.session.profesor,
            hotdia: req.session.diashor,
            seccion: req.session.seccion
        })
    }else{
        res.render('e-asig',{
            login: false,
            name: 'Debe iniciar sessión'
        })
    }
})
// Verificación de acción seleccionada por Estudiante
app.post('/accion-estudiante', async (req, res) => {
    const botonSeleccionado = Object.keys(req.body)
    connection.query('CALL SP_obtener_datos(?)', [req.session.curprof], (err, results) => {
        req.session.archivos = results[0]
        req.session.evaluaciones = results[1]
        if(botonSeleccionado.join('')=='unidades'){
            res.redirect('/e-unidad')
        }else if(botonSeleccionado.join('')=='evaluaciones'){
            res.redirect('/e-evalu')
        }else{
            res.redirect('/e-notas')
        }
    })
})
// Renderizar página de accion de estudiante - unidades
app.get('/e-unidad', (req,res) => {
    if(req.session.loggedin && req.session.type == 1){
        res.render('e-unidades', {
            name: req.session.name,
            archivos: req.session.archivos,
            evaluaciones: req.session.evaluaciones, 
            nomCurso: req.session.descurso,
            seccion: req.session.seccion,
            login: true
        })
    } else{
        res.render('index-e',{
            login: false,
            name: 'Debe iniciar sessión'
        })
    }  
})
// Renderizar página de accion de estudiante - evaluaciones
app.get('/e-evalu', (req,res)=>{
    if(req.session.loggedin && req.session.type == 1){
        res.render('e-evalu', {
            name: req.session.name,
            archivos: req.session.archivos,
            evaluaciones: req.session.evaluaciones,
            login: true,
            seccion: req.session.seccion,
            nomCurso: req.session.descurso
        })
    }else{
        res.render('index-e',{
            login: false,
            name: 'Debe iniciar sessión'
        })
    }
})
// Renderizar página de accion de estudiante - calificaciones
app.get('/e-notas', (req,res) => {
    if(req.session.loggedin && req.session.type == 1){
        connection.query('CALL SP_notas_estudiante(?, ?)', [req.session.cod, req.session.curprof], (err, results) => {
            req.session.notas = results[0]
            req.session.promedio = results[1]
            res.render('e-calificaciones',{
                login: true,
                name: req.session.name,
                notas: req.session.notas,
                promedio: req.session.promedio,
                nomC: req.session.descurso,
                seccion: req.session.seccion
            })
        })
    }else{
        res.render('index-e',{
            login: false,
            name: 'Debe iniciar sessión'
        })
    }
})

// Página index-p - Profesor
app.get('/mainp', (req, res) => {
    if(req.session.loggedin && req.session.type == 2){
        connection.query('CALL SP_aulas(?)', [req.session.cod], (err, results) => {
            req.session.infoAula = results[0] 
            res.render('index-p',{
                login: true,
                name: req.session.name,
                infoAula: req.session.infoAula,
                seccion: req.session.seccion
            })
        })
    }else{
        res.render('index-p',{
            login: false,
            name: 'Debe iniciar sessión'
        })
    }
})
// Formulario /vaula
app.post('/vaula', async (req, res) => {
    const btnSeleccionado = Object.keys(req.body).find(key => key.startsWith('gs_'))
    const idAula = btnSeleccionado.replace('gs_', '')
    const gs = idAula.split('')
    const grado = parseInt(gs[0])
    const seccion = gs[1]
    const getDatosAula = () => {
        return new Promise((resolve, reject) => {
            connection.query('CALL SP_datos_aula(?, ?, ?)', [req.session.cod, seccion, grado], (err, results) => {
                if (err) {
                    reject(err)
                } else{
                    req.session.aulaInfo = results[0]
                    req.session.curprof = results[0][0].IDCURPROF
                    req.session.gradoAula = results[0][0].GRADOAULA
                    req.session.seccionAula = results[0][0].SECCAULA
                    resolve(results)
                }
            })
        })
    }
    const getEstudiantes = () => {
        return new Promise((resolve, reject) => {
            connection.query('CALL SP_lista_estudiantes_aula(?)', [req.session.curprof], (err, results) => {
                if (err){
                    reject(err)
                } else{
                    req.session.alumnosAula = results[0]
                    resolve(results)
                }
            })
        })
    }
    try {
        const datosAula = await getDatosAula()
        const estudiantes = await getEstudiantes()
        res.redirect('/aula-prof')
    } catch (err) {
        console.log(err)
    }
})
// Página p-aula.ejs
app.get('/aula-prof', (req, res) => {
    if(req.session.loggedin && req.session.type == 2){
        res.render('p-aula',{
            login: true,
            name: req.session.name,
            aulaInfo: req.session.aulaInfo,
            curprof: req.session.curprof,
            gradoAula: req.session.gradoAula,
            seccionAula: req.session.seccionAula,
            alumnosAula: req.session.alumnosAula,
            seccion: req.session.seccion
        })
    }else{
        res.render('index-p',{
            login: false,
            name: 'Debe iniciar sessión'
        })
    }
})
// Verificación de acción seleccionada por Profesor   
app.post('/accion-docente', async (req,res) => {
    const btnAccProfesor = Object.keys(req.body);
    const accionBtn = btnAccProfesor.join('');
    if (accionBtn == 'unidades') {
        connection.query('CALL SP_obtener_datos(?)', [req.session.curprof], (err, results) => {
            req.session.archivos = results[0]
            req.session.evaluaciones = results[1]
            res.redirect('/aula-unidades')
        })
    } else if (accionBtn == 'evaluaciones') {
        connection.query('CALL SP_obtener_datos(?)', [req.session.curprof], (err, results) => {
            req.session.archivos = results[0]
            req.session.evaluaciones = results[1]
            res.redirect('/aula-evaluaciones')
        })
    } else if (accionBtn == 'notas') {
        connection.query('CALL SP_lista_notas_aula(?)', [req.session.curprof], (err, results) => {
            req.session.notasalum = results[0]
            req.session.neval = results[1]
            res.redirect('/aula-notas')
        })
    } else {
        connection.query('CALL SP_lista_estudiantes_aula(?)', [req.session.curprof], (err, results) => {
            req.session.alumnos = results[0]
            res.redirect('/aula-asistencia')
        })
    }
})

// Ventana Unidades - Página p-aula-unidades.ejs
app.get('/aula-unidades', (req, res) => {
    let clasesExistentes = [];
    let todasSesiones = [];
    if(req.session.loggedin && req.session.type == 2){
        connection.query('CALL SP_obtener_sesiones(?)', [req.session.curprof], async(err,results) => {
            req.session.archivos.forEach(elemento => {
                clasesExistentes.push(elemento.IDARC)
            });

            for (i = 0; i<results[0].length; i++){
                todasSesiones.push(results[0][i])
            }

            //VERIFICACION INEXISTENCIA
            let clasesInexistentes = []
            for(k = 0; k < todasSesiones.length; k++){
                if(todasSesiones[k].ID_ARCHIVO === null){
                    clasesInexistentes.push(todasSesiones[k])
                }
            }

            req.session.clasesInexistentes = clasesInexistentes
            res.render('p-aula-unidades',{
                login: true,
                name: req.session.name,
                aulaInfo: req.session.aulaInfo,
                curprof: req.session.curprof,
                archivos: req.session.archivos,
                evaluaciones: req.session.evaluaciones,
                gradoAula: req.session.gradoAula,
                seccionAula: req.session.seccionAula,
                alumnosAula: req.session.alumnosAula,
                sesionesOpciones: req.session.clasesInexistentes,
                seccion: req.session.seccion
            })
        })

    }else{
        res.render('index-p',{
            login: false,
            name: 'Debe iniciar sessión'
        })
    }
})
// Editar Clase           
app.post('/editar-post', async(req, res) => {
    const nomClase = req.body.nomClase
    const linkClase = req.body.linkClase
    const sesionID = req.body.sesionID
    connection.query('CALL SP_editar_ses(?,?,?)',[nomClase, linkClase, sesionID], async (err, results) => {
        res.render('p-aula-unidades',{
            login: true,
            name: req.session.name,
            alert: true,
            alertTitle: "Clase editada",
            alertMessage: "Se editó la clase con exito, regrese y vuelva a la página para actualizar cambios",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: 'aula-unidades',
            aulaInfo: req.session.aulaInfo,
            curprof: req.session.curprof,
            archivos: req.session.archivos,
            evaluaciones: req.session.evaluaciones,
            gradoAula: req.session.gradoAula,
            seccionAula: req.session.seccionAula,
            alumnosAula: req.session.alumnosAula,
            seccion: req.session.seccion
        })
    })
})

// OJO ###################################################

// ELIMINAR CLASES
app.post('/sesiones-elim-edit', async(req,res) => {
    const claseId = req.body.eliminarSesionBtn
    connection.query('CALL SP_eliminar_clase(?)', [claseId], async(err, results) => {
        res.redirect('aula-unidades')
    })
    //VOLVER AL LOGIN PARA QUE SE GUARDE AL CAMBIO
})

// AGREGAR CLASES
app.post('/agregar-clase',async(req,res) => {
    let nomClase = req.body.nomClase
    let linkClase = req.body.linkClase
    let sesionesPosiblesAgregar = req.body.sesionesPosiblesAgregar

    connection.query('CALL SP_agregar_clase(?,?,?)',[nomClase,linkClase,sesionesPosiblesAgregar], async(err,results) => {
        res.redirect('/aula-unidades')
    })
})

// Entrar a evaluaciones - Profesor 
app.get('/aula-evaluaciones', (req,res) => {
    if(req.session.loggedin && req.session.type == 2){
        res.render('p-aula-evaluaciones',{
            login: true,
            name: req.session.name,
            archivos: req.session.archivos,
            evaluaciones: req.session.evaluaciones,
            seccion: req.session.seccion
        })
    }else{
        res.render('index-p',{
            login: false,
            name: 'Debe iniciar sessión'
        })
    }
})

// Calificar Evaluacion - Profesor
app.post('/calificar', async (req,res) => {
    const btnSeleccionado = parseInt(Object.keys(req.body).join(''))
    const getDatosEva = () => {
        return new Promise((resolve,reject) => {
            connection.query('CALL SP_informacion_evaluacion(?)', [btnSeleccionado], (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    console.log(results)
                    req.session.idEva = results[0][0].ID
                    req.session.titulocal = results[0][0]['TÍTULO']
                    resolve(results)
                }
            })
        })
    }
    const getDatosEstudiantes = () => {
        return new Promise((resolve, reject) => {
            connection.query('CALL SP_lista_estudiantes_aula(?)', [req.session.curprof], (err, results) => {
                if (err){
                    reject(err)
                } else{
                    console.log(results)
                    req.session.alumnosA = results[0]
                    resolve(results)
                }
            })
        })
    }
    try {
        const datosAula = await getDatosEva()
        const estudiantes = await getDatosEstudiantes()
        res.redirect('/p-calificacion')
    } catch (err) {
        console.log(err)
    }
})

app.get('/p-calificacion', (req,res) => {
    if(req.session.loggedin && req.session.type == 2){
        res.render('p-calificaciones',{
            login: true,
            alumnosA: req.session.alumnosA,
            idEva: req.session.idEva,
            tituloEva: req.session.titulocal,
            name: req.session.name,
            seccion: req.session.seccion
        })
    }else{
        res.render('index-p',{
            login: false,
            name: 'Debe iniciar sessión'
        })
    }
})

// Enviar calificaciones - Profesor 
app.post('/revisar', async (req,res) => {
    const codAlumno = Object.keys(req.body)
    const notAlumno = Object.values(req.body)
    console.log(codAlumno)
    console.log(notAlumno)
    console.log(req.session.idEva)
    for (let i = 0; i < codAlumno.length; i++) {
        connection.query('CALL SP_guardar_calificacion(?,?,?)', [notAlumno[i], codAlumno[i], req.session.idEva], (err, results) => {
            
        })
    }
    res.redirect('/p-calificacion')
})

// Entrar a notas - Profesor
app.get('/aula-notas', (req,res) => {
    if(req.session.loggedin && req.session.type == 2){
        res.render('p-aula-notas',{
            login: true,
            name: req.session.name,
            notaAlum: req.session.notasalum,
            numEval: req.session.neval,
            seccion: req.session.seccion
        })
    }else{
        res.render('index-p',{
            login: false,
            name: 'Debe iniciar sessión'
        })
    }
})

// Entrar a asistencia - Profesor
app.get('/aula-asistencia', (req,res) => {
    if(req.session.loggedin && req.session.type == 2){
        res.render('p-aula-asistencia',{
            login: true,
            name: req.session.name,
            horaActual: res.locals.horaActual,
            fechaActual: res.locals.fechaActual,
            alumnos: req.session.alumnos,
            seccion: req.session.seccion
        })
    }else{
        res.render('index-p',{
            login: false,
            name: 'Debe iniciar sessión'
        })
    }
})

app.post('/asistencia', (req,res) => {
    const arreglo = Object.keys(req.body)
    const fecha = arreglo.pop()
    let alum = ''
    for (let i = 0; i < arreglo.length; i++){
        alum = alum + arreglo[i] + ','
    }
    alum = alum.substring(0,alum.length - 1)
    console.log(alum)
    const id = 1;
    console.log(arreglo)
    console.log(fecha)
    connection.query('CALL SP_agregar_falta(?,?, ?)',[id,fecha,alum], async (err, results) => {
        res.redirect('/aula-asistencia')
    })
})

// Editar Evaluaciones - Profesor
app.post('/editar-evaluacion', async(req,res) => {
    const idEvaluacion = req.body.sesionID
    const nomEvalu = req.body.nomEvalu
    const descripEva = req.body.descripEva
    const fechaIni = `${req.body.fechaIni} 00:00:00`
    const fechaFin = `${req.body.fechaFin} 00:00:00`
    const linkEva = req.body.linkEva
    const tipoEva = req.body.tipoEva

    connection.query('CALL SP_editar_evaluacion(?,?,?,?,?,?,?)',[idEvaluacion, nomEvalu,descripEva,fechaIni,fechaFin,linkEva,tipoEva], async (err, results) => {
        res.redirect('/aula-evaluaciones')
    })
})

// Agregar Evaluacion - Profe
app.post('/agregar-evaluacion', async(req,res) => {
    const nomEvalu = req.body.nomEvalu
    const descripEva = req.body.descripEva
    const fechaIni = `${req.body.fechaIni} 00:00:00`
    const fechaFin = `${req.body.fechaFin} 00:00:00`
    const linkEva = req.body.linkEva
    const tipoEva = req.body.tipoEva
    const idSesion = req.body.clasesPosibles

    connection.query('CALL SP_agregar_evaluacion_sesionExiste(?,?,?,?,?,?,?)', [nomEvalu,descripEva,fechaIni,fechaFin,linkEva,tipoEva,idSesion], async(err,results) => {
        res.redirect('/aula-evaluaciones')
    })
})






app.get('/d-alum-c', (req,res) => {
    if(req.session.loggedin && req.session.type == 3){
        res.render('d-alum-c',{
            name: req.session.name,
            login:true,
            seccion: req.session.seccion
        })
    }else{
        res.render('d-alum-c',{
            login: false,
            name: 'Debe iniciar sessión'
        })
    }
})

//USANDO NODE
app.get('/e-evalu', (req,res)=>{
    res.render('e-evalu')
})
app.get('/d-alum-s', (req,res) => {
    if(req.session.loggedin && req.session.type == 3){
        res.render('d-alum-s',{
            name: req.session.name,
            login:true,
            seccion: req.session.seccion,
            grado: req.session.gradoSeleccionado,
            estadistica : req.session.estadistica
        })
    }else{
        res.render('d-alum-s',{
            login: false,
            name: 'Debe iniciar sessión'
        })
    }
})
app.get('/d-doce-d', (req,res) => {
    if(req.session.loggedin && req.session.type == 3){
        res.render('d-doce-d',{
            name: req.session.name,
            login:true,
            seccion: req.session.seccion,
            docentes: req.session.docentes,
            estadisticaAsig: req.session.doceAsigEstadistica
        })
    }else{
        res.render('d-doce-d',{
            login: false,
            name: 'Debe iniciar sessión'
        })
    }
})

app.get('/d-seleccion-docente', (req,res) => {
    if(req.session.loggedin && req.session.type == 3){
        res.render('d-seleccion-docente',{
            name: req.session.name,
            login:true,
            seccion: req.session.seccion
        })
    }else{
        res.render('d-seleccion-docente',{
            login: false,
            name: 'Debe iniciar sessión'
        })
    }
})
//#endregion

// Cerrar sesión
app.get('/logout', (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
})
// Guardar el puerto en una variable
const PUERTO = process.env.PORT || 3000 
// Inicializar el servidor
app.listen(PUERTO)
console.log(`EL SERVIDOR ESTÁ CONECTADO EN EL PUERTO: ${PUERTO}`)