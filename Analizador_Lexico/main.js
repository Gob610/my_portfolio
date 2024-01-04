let palabrasReservadas = ["function","default","toList","except","string","return","switch","while","toStr","error","false","toDec","toInt","toTup","input","lower","upper","print","break","elif","bool","else","case","list","true","int","dec","tup","len","max","min","try","for","cap","dic","if","in"];

let btnAnalizar = document.getElementById("btnAnalizar");
let btnLimpiar = document.getElementById("btnLimpiar");


//FUNCIONES
function limpiar(){
    document.getElementById("entrada").value = "";
    let padre = document.querySelector(".terminos_container");
    // BUCLE PARA ELIMINAR LOS HIJOS DEL NODO PADRE
    while(padre.hasChildNodes()){
        padre.removeChild(padre.firstChild);
    }
}

function recogerDato(){
    respuesta = document.getElementById("entrada").value;
}


function comentario(respuesta){
    let a = respuesta.split("");
    //CONTADOR PARA SABER SI HAY O NO, SIGNO DE COMENTARIO
    let contadorGuiones = 0;
    for(let i = 0; i < a.length; i++){
        if(a[i] == "_"){
            //SEPARA LA PARTE DE LA CADENA QUE ES UN COMENTARIO                   
            c = respuesta.slice(i);            
            //GUARDAMOS LA PARTE RESTANTE DE LA CADENA
            modificadoComentario = respuesta.substring(0, i);
            //CREAMOS LOS ELEMENTOS QUE CAPTURARAN LOS VALORES ESCRITOS
                //PARA EL VALOR TOKEN
            let elemento = document.createElement("p");
            elemento.className="";
            let valor = document.createTextNode(c);
            elemento.appendChild(valor);
                //PARA LA DESCRIPCIÓN
            let elemento2 = document.createElement("p");
            elemento2.className="";
            let valor2 = document.createTextNode("Es un comentario");
            elemento2.appendChild(valor2);
            //AÑADIMOS LOS ELEMENTOS CREADOS A UN DIV CREADO COMO CONTENEDOR
            let elementodiv = document.createElement("div");
            elementodiv.className="terminosEncontrados";
            elementodiv.appendChild(elemento);
            elementodiv.appendChild(elemento2);
            //AÑADIMOS ESTE DIV CREADO
            let contenedor = document.querySelector(".terminos_container");
            contenedor.appendChild(elementodiv);
            contadorGuiones += 1;
        }else if(contadorGuiones == 0){
            modificadoComentario = respuesta;
        }
    }
}

function quitarEspacio(modificadoComentario){
    // sinEspacio = modificadoComentario.replace(/\s/g,'');
    sinEspacio = modificadoComentario;
}

function encontrarCadena(sinEspacio){
    let hlp = [-1];
    let posibilidad = true;
    modificadoCadena="";
    let cadenaEncontrada;
    for(let i = 0; i < hlp.length; i++){
        //identificar el " que abre
        let hlp1 = sinEspacio.indexOf('"',hlp[i]+1);
        //identificar el " que cierra
        let hlp2 = sinEspacio.indexOf('"',hlp1+1);
        //IDENTIFICAR SI CUMPLE CON TENER LAS COMILLAS QUE ABREN Y LAS Q CIERRAN TMB
        if(hlp1 != -1 && posibilidad==true){
            if(hlp2 != -1){
                //Identifica la cadena encontrada
                cadenaEncontrada = sinEspacio.slice(hlp1,hlp2+1);
                z = sinEspacio.substring(0,hlp1);
                modificadoCadena = modificadoCadena + z+ " ";
                cx = sinEspacio.substring(hlp2+1);
                sinEspacio = cx;
                
                //Para que identifique los siguientes comentarios sin repetirse
                posibilidad = true;
                //CREAMOS LOS ELEMENTOS QUE CAPTURARAN LOS VALORES ESCRITOS
                    //PARA EL VALOR TOKEN
                let elemento = document.createElement("p");
                elemento.className="";
                let valor = document.createTextNode(cadenaEncontrada);
                elemento.appendChild(valor);
                    //PARA LA DESCRIPCIÓN
                let elemento2 = document.createElement("p");
                elemento2.className="";
                let valor2 = document.createTextNode("Es una cadena");
                elemento2.appendChild(valor2);
                //AÑADIMOS LOS ELEMENTOS CREADOS A UN DIV CREADO COMO CONTENEDOR
                let elementodiv = document.createElement("div");
                elementodiv.className="terminosEncontrados";
                elementodiv.appendChild(elemento);
                elementodiv.appendChild(elemento2);
                //AÑADIMOS ESTE DIV CREADO
                let contenedor = document.querySelector(".terminos_container");
                contenedor.appendChild(elementodiv);
            }else{
                posibilidad  = false;
            }
            i--;
        }else{
            modificadoCadena = modificadoCadena + sinEspacio;
        }
    }
}



const signos = [{
    id:"//", name: "Operador Aritmetico Modulo", esDoble: true
},{
    id:"^^", name: "Operador Aritmetico Potencia", esDoble: true
},{
    id:"+=", name: "Operador Suma Asignacion", esDoble: true
},{
    id:"-=", name: "Operador Resta Asignacion", esDoble: true
},{
    id:"/=", name: "Operador Division Asignacion", esDoble: true
},{
    id:"++", name: "Operador Aumento", esDoble: true
},{
    id:"--", name: "Operador Decremento", esDoble: true
},{
    id:"==", name: "Operador Comparacion Igualdad", esDoble: true
},{
    id:"*=", name: "Operador Multiplicacion Asignacion", esDoble: true
},{
    id:"<=", name: "Operador Comparacion Menor Igual", esDoble: true
},{
    id:">=", name: "Operador Comparacion Mayor Igual", esDoble: true
},{
    id: "&&", name: "Operador Logico AND", esDoble: true
},{
    id:"||", name: "Operador Logico OR", esDoble: true
},{
    id:"x°", name: "Operador Logico XOR", esDoble:true
},{
    id:"!>", name: "Operador Logico Condicional", esDoble:true
},{
    id:"<!", name: "Operador Logico Bicondicional", esDoble:true
},{
    id:"!", name: "Operador Logico Negacion", esDoble: false
},{
    id:"+", name: "Operador Aritmetico Adicion", esDoble: false
},{
    id:"-", name: "Operador Aritmetico Sustraccion", esDoble: false
},{
    id:"<", name: "Operador Comparacion Menor", esDoble: false
},{
    id:"*", name: "Operador Multiplicacion", esDoble:false
},{
    id:"/", name: "Operador Division", esDoble:false
},{
    id:"#", name: "Operador Raiz", esDoble:false
},{
    id:">", name: "Operador Comparacion Mayor", esDoble:false
},{
    id:"=", name: "Operador Asignacion", esDoble:false
},{
    id:"(", name: "Operador Delimitador Abre Argumento", esDoble:false
},{
    id:")", name: "Operador Delimitador Cierra Argumento", esDoble:false
},{
    id:"[", name: "Operador Delimitador Abre Lista", esDoble:false
},{
    id:"]", name: "Operador Delimitador Cierra Lista", esDoble:false
},{
    id:"{", name: "Operador Delimitador Abre Bloque Codigo", esDoble:false
},{
    id:"}", name: "Operador Delimitador Abre Bloque Codigo", esDoble:false
},{
    id:":", name: "Operador Delimitador Clave Diccionario", esDoble:false
},{
    id:",", name: "Operador Delimitador Separador", esDoble:false
},{
    id:";", name: "Operador Delimitador Cierra Codigo", esDoble:false
},{
    id:".", name: "Operador Atributos o Propiedades", esDoble:false
}];

function encontrarSignos(modificadoCadena){
    let aux3 = [modificadoCadena];
    for(let k = 0; k < aux3.length; k++){
        let yaEncontro = false;
        let contador = 0;
        for(let j=0; j < signos.length; j++){
            let apuntador = [0];
            let aux1, aux2;
            if(yaEncontro == true){
                break;
            }
            //HACER LA CUENTA PARA VERIFICAR Q ES LO Q ESTA PASANDO
            for(let i = 0; i<apuntador.length; i++) {
                //indice de donde esta el signo
                let indice = aux3[k].indexOf(signos[j].id,apuntador[i]);
                //si ha encontrado algo...
                if(indice != -1){
                    //si es doble...
                    if(signos[j].esDoble == true){
                        aux1 = aux3[k].slice(apuntador[i],indice);
                        aux2 = aux3[k].slice(indice+2);
                        //juntar la nueva cadena
                        nuevaCadena = aux1+" "+aux2;
                        aux3.push(nuevaCadena);
                        yaEncontro = true;
                        contador += 1;
                        
                        apuntador.push(indice+2);
                        //PARA EL VALOR TOKEN
                        let elemento = document.createElement("p");
                        let valor = document.createTextNode(signos[j].id);
                        elemento.appendChild(valor);
                        //PARA LA DESCRIPCIÓN
                        let elemento2 = document.createElement("p");
                        let valor2 = document.createTextNode("Es un "+signos[j].name);
                        elemento2.appendChild(valor2);
                        //AÑADIMOS LOS ELEMENTOS CREADOS A UN DIV CREADO COMO CONTENEDOR
                        let elementodiv = document.createElement("div");
                        elementodiv.className="terminosEncontrados";
                        elementodiv.appendChild(elemento);
                        elementodiv.appendChild(elemento2);
                        //AÑADIMOS ESTE DIV CREADO
                        let contenedor = document.querySelector(".terminos_container");
                        contenedor.appendChild(elementodiv);
                        break;
                    }else{
                        aux1 = aux3[k].slice(apuntador[i],indice);
                        aux2 = aux3[k].slice(indice+1);
                        nuevaCadena = aux1+" "+aux2;
                        aux3.push(nuevaCadena);
                        yaEncontro = true;
                        contador += 1;

                        apuntador.push(indice+1);
                        //PARA EL VALOR TOKEN
                        let elemento = document.createElement("p");
                        let valor = document.createTextNode(signos[j].id);
                        elemento.appendChild(valor);
                        //PARA LA DESCRIPCIÓN
                        let elemento2 = document.createElement("p");
                        let valor2 = document.createTextNode("Es un "+signos[j].name);
                        elemento2.appendChild(valor2);
                        //AÑADIMOS LOS ELEMENTOS CREADOS A UN DIV CREADO COMO CONTENEDOR
                        let elementodiv = document.createElement("div");
                        elementodiv.className="terminosEncontrados";
                        elementodiv.appendChild(elemento);
                        elementodiv.appendChild(elemento2);
                        //AÑADIMOS ESTE DIV CREADO
                        let contenedor = document.querySelector(".terminos_container");
                        contenedor.appendChild(elementodiv);
                        break;
                    }
                }
            }
        }
    }
    premodificadoSigno = aux3[aux3.length-1];
    modificadoSigno = premodificadoSigno.replace(/\s\s+/g," ");
}


function encontrarReservadas(modificadoSigno){
    //ANALIZANDO
    let analizando = [modificadoSigno];
    for(let k = 0; k < analizando.length; k++){
        let yaEncontro = false;
        let contador = 0;
        for(let j=0; j < palabrasReservadas.length; j++){
            let apuntador = [0];
            let aux1, aux2;
            if(yaEncontro == true){
                break;
            }
            //HACER LA CUENTA PARA VERIFICAR Q ES LO Q ESTA PASANDO
            for(let i = 0; i<apuntador.length; i++) {
                //indice de donde esta el signo
                let indice = analizando[k].indexOf(palabrasReservadas[j],apuntador[i]);

                //si ha encontrado algo...
                if(indice != -1){
                    //QUE VERIFIQUE SI HAY LETRAS EN SUS EXTREMOS

                        aux1 = analizando[k].slice(apuntador[i],indice);
                        aux2 = analizando[k].slice(indice+palabrasReservadas[j].length);
                        //juntar la nueva cadena
                        nuevaCadena = aux1+" "+aux2;
                        analizando.push(nuevaCadena);
                        yaEncontro = true;
                        contador += 1;
                    
                        apuntador.push(indice+palabrasReservadas[j].length);
                        //PARA EL VALOR TOKEN
                        let elemento = document.createElement("p");
                        let valor = document.createTextNode(palabrasReservadas[j]);
                        elemento.appendChild(valor);
                        //PARA LA DESCRIPCIÓN
                        let elemento2 = document.createElement("p");
                        let valor2 = document.createTextNode("Es una palabra reservada");
                        elemento2.appendChild(valor2);
                        //AÑADIMOS LOS ELEMENTOS CREADOS A UN DIV CREADO COMO CONTENEDOR
                        let elementodiv = document.createElement("div");
                        elementodiv.className="terminosEncontrados";
                        elementodiv.appendChild(elemento);
                        elementodiv.appendChild(elemento2);
                        //AÑADIMOS ESTE DIV CREADO
                        let contenedor = document.querySelector(".terminos_container");
                        contenedor.appendChild(elementodiv);
                    break;
                }
            }
        }
    }
    premodificadoReservada = analizando[analizando.length-1];
    modificadoReservada = premodificadoReservada.replace(/\s\s+/g," ");
}

function encontrarNumero(modificadoReservada) {
    modificadoNumero = "";
    modificadoReservada = modificadoReservada.trim();
    arr = modificadoReservada.split(" ");
    for(let i = 0; i < arr.length; i++){
        if(parseInt(arr[i]) || arr[i] == 0){
            arr2 = arr[i].split("");
            for(let j = 0; j < arr2.length; j++){
                if(parseInt(arr2[j])||arr2[j] == 0){
                    error= -1;
                }else{
                    error = 0;
                    break;
                }
            }
            if(error === -1){
                //CREAMOS LOS ELEMENTOS QUE CAPTURARAN LOS VALORES ESCRITOS
                    //PARA EL VALOR TOKEN
                let elemento = document.createElement("p");
                elemento.className="";
                let valor = document.createTextNode(arr[i]);
                elemento.appendChild(valor);
                    //PARA LA DESCRIPCIÓN
                let elemento2 = document.createElement("p");
                elemento2.className="";
                let valor2 = document.createTextNode("Es un Número");
                elemento2.appendChild(valor2);
                //AÑADIMOS LOS ELEMENTOS CREADOS A UN DIV CREADO COMO CONTENEDOR
                let elementodiv = document.createElement("div");
                elementodiv.className="terminosEncontrados";
                elementodiv.appendChild(elemento);
                elementodiv.appendChild(elemento2);
                //AÑADIMOS ESTE DIV CREADO
                let contenedor = document.querySelector(".terminos_container");
                contenedor.appendChild(elementodiv);
            }else{
                modificadoNumero = modificadoNumero + arr[i];
            }
        }else{
            modificadoNumero = modificadoNumero + arr[i] + " ";
        }
    }
}

function encontrarIdentificadores(modificadoNumero){
    modificadoIdentificador = "";
    modificadoNumero = modificadoNumero.trim();
    arr = modificadoNumero.split(" ");
    for(let i=0; i<arr.length;i++){
        arr2=arr[i].split("");
        if(parseInt(arr2[0])||arr2[0]==0){
            modificadoIdentificador = modificadoIdentificador + arr[i];
        }else{
            //CREAMOS LOS ELEMENTOS QUE CAPTURARAN LOS VALORES ESCRITOS
                //PARA EL VALOR TOKEN
            let elemento = document.createElement("p");
            elemento.className="";
            let valor = document.createTextNode(arr[i]);
            elemento.appendChild(valor);
                //PARA LA DESCRIPCIÓN
            let elemento2 = document.createElement("p");
            elemento2.className="";
            let valor2 = document.createTextNode("Es un Identificador");
            elemento2.appendChild(valor2);
            //AÑADIMOS LOS ELEMENTOS CREADOS A UN DIV CREADO COMO CONTENEDOR
            let elementodiv = document.createElement("div");
            elementodiv.className="terminosEncontrados";
            elementodiv.appendChild(elemento);
            elementodiv.appendChild(elemento2);
            //AÑADIMOS ESTE DIV CREADO
            let contenedor = document.querySelector(".terminos_container");
            contenedor.appendChild(elementodiv);
        }
    }
}


//EVENTOS
btnAnalizar.addEventListener("click",()=>recogerDato());
btnAnalizar.addEventListener("click",()=>comentario(respuesta));
btnAnalizar.addEventListener("click",()=>quitarEspacio(modificadoComentario));
btnAnalizar.addEventListener("click",()=>encontrarCadena(sinEspacio));
btnAnalizar.addEventListener("click",()=>encontrarSignos(modificadoCadena));
btnAnalizar.addEventListener("click",()=>encontrarReservadas(modificadoSigno));
btnAnalizar.addEventListener("click",()=>encontrarNumero(modificadoReservada)); 
btnAnalizar.addEventListener("click",()=>encontrarIdentificadores(modificadoNumero));

btnLimpiar.addEventListener("click",()=>limpiar());