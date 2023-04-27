//Importar el paquete debug 
//el  parametro indica el archivo y el entorno de depuracion
const inicioDebug = require('debug')('app:inicio')
const dbDebug = require('debug')('app:db')

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

const usuarios = [
    {id:0, nombre: 'Raul'},
    {id:1, nombre: 'Jesus'},
    {id:2, nombre: 'Abraham'},
    {id:3, nombre: 'Alex'},
    {id:4, nombre: 'Dieguita'},
]

function existeUsuario(id){
    //parseInt hace el casteo a valores enteros directamente
    //Devuelve le primer usuario que cumpla con el predicado
    return usuarios.find(u => u.id === parseInt(id))
}

function validarUsuario(nom){
    //Si no se manda el atributo nombre
    //O el nombre tienelongitud menor a dos
    //Validacion y creacion del schema con joi

    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    })

    return schema.validate({nombre: nom})
}

//Consulta en la ruta raiz del sitio
//Toda peticion siempre va a recibir dor parametros
//Req: loque recibe el servidor desde el cliente
//res: la informacion que responde el servidor al clente
//Vamos a utilizar el metodo send del objeto res
app.get('/', (req, res) => {
    res.send('Hola mundo desde Expresss..')
})

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios)
})

//con los : delante del id
//Express sae que es un parametro a recibir en la ruta
app.get('/api/usuarios/:id', (req, res) => {
    // En el cuerpo del objetp req esta la propiedad
    // params que guarda los parametros enviados
    //const array = ['Joreg', 'Jesus', 'Abraham', 'Alex']
    //const pos = req.params.id
    //res.send(req.params.id)
    //res.send(array[pos])
    let usuario = existeUsuario(req.params.id)
    if(!usuario){
        res.status(404).send(`El usuario ${req.params.id} no se encontro`)
        return
    }
    res.send(usuario)
    return
})

// Recibiendo varios parametros
// Query strings
// localhost:300/api/usuarios/1990/2/?nombre=xxxx&single
app.get('/api/usuarios/:year/:month', (req, res) => {
    //En el cuerpo de req esta la respuesta
    // query que guarda los parametros Query String
    res.send(req.query)
})


//La ruta tiene el mismos nombre que la peticios GET
//Express hace la diferencia dependiendo del tpo de petiion
//La peticion post se utiliara para insertar un nueo usuario en nuestro arreglo
app.post('/api/usuarios', (req, res) => {
    //El obejto request tiene la propiedad body
    //que va a venir en formati JSON
    
    //Se descomponen los valores de error y valor en la variable "erros, value"
    const {error, value} = validarUsuario(req.body.nombre)
    if(!error){
        const usuario = {
            id: usuarios.length + 1,
            nombre: req.body.nombre
        }
        usuarios.push(usuario)
        res.send(usuario) 
    }else{
        const mensaje = error.details[0].message
        res.status(400).send(mensaje)

    }
    return
})

//Se utiliza para modificar datos existentes
//Este metodo debe recibir un parametro
//Id para saber que usuario modificar
app.put('/api/usuarios/:id', (req, res) => {
    //Encontrar si existe el usuario

    let usuario = existeUsuario(req.params.id)
    if (!usuario){
        res.status(404).send('El usuario no se encuentra')
        return
    }

    //validar si el dato recibido es correcto
    const {error, value} = validarUsuario(req.body.nombre)
    if(!error){
        //Actualiza el nombre
        usuario.nombre = value.nombre
        res.send(usuario)
    }else{
        const mensaje = error.details[0].message
        res.status(400).send(mensaje)
    }
    return
})

//Recibe el usuario que se desea eliminar
app.delete('/api/usuarios/:id', (req, res) => {
    const usuario = existeUsuario(req.params.id)
    if(!usuario){
        res.status(404).send('El usuario no se encuentra')
        return
    }
    //encontrar el indice del usuario
    const index =  usuarios.indexOf(usuario)
    usuarios.splice(index, 1) //elimina el usuario en elindice

    res.send(usuario)//Se responde con el usuario eliminado
    return
})

app.get('/api/productos', (req, res) => {
    res.send(['mouse', 'teclado', 'bocinas'])
})


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


















