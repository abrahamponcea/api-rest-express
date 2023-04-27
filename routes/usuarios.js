const express = require('express')
const Joi = require('joi')
const ruta = express.Router()


const usuarios = [
    {id:0, nombre: 'Raul'},
    {id:1, nombre: 'Jesus'},
    {id:2, nombre: 'Abraham'},
    {id:3, nombre: 'Alex'},
    {id:4, nombre: 'Dieguita'},
]

//Devuelve todos los usuarios
ruta.get('/', (req, res) => {
    res.send(usuarios)
})

//con los : delante del id
//Express sae que es un parametro a recibir en la ruta
ruta.get('/:id', (req, res) => {
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


//La ruta tiene el mismos nombre que la peticios GET
//Express hace la diferencia dependiendo del tpo de petiion
//La peticion post se utiliara para insertar un nueo usuario en nuestro arreglo
ruta.post('/', (req, res) => {
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
ruta.put('/:id', (req, res) => {
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
ruta.delete('/:id', (req, res) => {
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

module.exports = ruta //se exporta el objeto ruta
