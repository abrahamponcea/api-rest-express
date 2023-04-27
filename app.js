//Importar el paquete debug 
//el  parametro indica el archivo y el entorno de depuracion
const inicioDebug = require('debug')('app:inicio')
const dbDebug = require('debug')('app:db')
const usuarios = require('./routes/usuarios')
const productos = require('./routes/productos')
const express = require('express') //Importa elpaquete
const Joi = require('joi')
const app = express() //Crea una instancia de express
const logger = require('./logger')
const morgan = require('morgan')
const config = require('config')

//Cuales son los mettodos de expresss a implementar
//con su ruta
/* 
app.get()//CConsulta
app.post() //Envio de datos al servidor (insertar datos en la base)
app.put()//Actualizacion
app.delete()//Eliminacion
 */

app.use(express.json()) //Le decimos a express que use este middleware

//Define el uso de la libreria qs para separar la informacion
//codificada en el URL
app.use(express.urlencoded({extended:true}))//Nuevo Middleware

app.use(express.static('public'))//Nuevo middleware, nombre de la carpeta que tendra los archivos(recursos estaticos)

//El primer parametro es la ruta raiz asosiada con las peticiones
//a los datos de los usuarios la ruta se va concatenar como prefijo
//al inicio de todos las rutas definidas en el archivo usuarios.js
app.use('/api/usuarios', usuarios)//Middleware que importamos
app.use('/api/productos', productos)//Middleware que importamos

console.log(`Aplicacion: ${config.get('nombre')}`)
console.log(`BD Server: ${config.get('configDB.host')}`)

if(app.get('env') === 'development'){
    app.use(morgan('tiny'))
    //console.log('Morgan habilitado...')
    inicioDebug('Morgan esta habilitado...')
}

dbDebug('Conectando con la base de datos...')

/* 
app.use(logger) //Loger ya hace referancia a la fincion log de logger.js debido al exports

app.use(function(req, res, next){
    console.log('Atenticando...')
    next()
})
 */
//Los tres app.use() son middlewares y se lllaman antes de
//las funciones de ruta GET, POST, PUT, DELETE
//Para que estas pueda tranbajar




//Consulta en la ruta raiz del sitio
//Toda peticion siempre va a recibir dor parametros
//Req: loque recibe el servidor desde el cliente
//res: la informacion que responde el servidor al clente
//Vamos a utilizar el metodo send del objeto res
app.get('/', (req, res) => {
    res.send('Hola mundo desde Expresss..')
})

// Recibiendo varios parametros
// Query strings
// localhost:300/api/usuarios/1990/2/?nombre=xxxx&single
/* app.get('/api/usuarios/:year/:month', (req, res) => {
    //En el cuerpo de req esta la respuesta
    // query que guarda los parametros Query String
    res.send(req.query)
})
 */



//El modulo process, contiene información delsistema
//El objeto env contiene informacion de las variables 
//del entorno
//Si la variable PORT no existe que tome un valor definido por nosotros (3000)
const port = process.env.PORT || 3000 

app.listen(port, () => {
    console.log('Escuchando en el puerto ' + port)
})



/*
    Funciones Middleware
    
    El middlewaare es un bloque de codigo que se ejecuta entre las peticiones del usuario
    (reques) y la peticion que llega al servidor. Es un enlace entre la peticion
    del usuariio y el servidor, antes de que se puedea dar una respuesta

    las Funciones de middleware son funciones que tienen acceso al objeto
    se solicitud al objet de respuesta (res)
    y a la siguiente funcion de middleware en el ciclo de 
    solicitud/respuestas de la aplicacion.L asiguiente
    funcion de middleware se denta normalmente con una
    variable denominan next

    las funciones de middleware pueden realizar las siguientes tareas:

    -Ejecuatar cualquier codigo.
    -Realizar camios en la solicitud y los objetos de respuesta
    -Finalizar el ciclo de solicitud/respuestas
    -Invoca la siguente funcion de middleware en la pila

    Express en un framework de direccionamiento y uso de middleware
    que permite que la aplicacion tenga funcionalidad minima propia

    Ya hemos utilizado algunos middleare como express.json
    que transforma el body de req a formato JSON

    -----------------------------------------
    request --|--> json() --> route() --|--> responde
    -------------------------------------------------

    route() --> Funcion GET, POST, PUT, DELETE

    Una aplicacion expres puede utilizar los siguientes tipos de middleware

    --Middleware de nivel de aplicacion
    --Middleware de nivel de direccionador
    --Middleware de manejo de errores 
    --Middleware incorporado
    --Middleware de terceros
    
    

    -----------Recursos estaticos-------------
    Los recursos estatico hacen referenci a archivos
    imagenes, documentos que se ubican en el servidor
    vamos a utilizar un middleware para poser acceder a esos recursos


 */


















