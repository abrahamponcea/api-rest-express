const express = require('express')
const Joi = require('joi')
const ruta = express.Router()


const productos = [
    {id:0, nombre: 'Pantalla'},
    {id:1, nombre: 'Laptop'},
    {id:2, nombre: 'Mouse'},
    {id:3, nombre: 'Gabinete'},
    {id:4, nombre: 'Consola'},
]

ruta.get('/', (req, res) => {
    res.send(productos)
})

ruta.get('/:id', (req, res) => {
    let producto = existeProducto(req.params.id)
    if(!producto){
        res.status(404).send(`El producto ${req.params.id} no se encontro`)
        return
    }
    res.send(producto)
    return
})

ruta.post('/', (req, res) => {
    const {error, value} = validarProducto(req.body.nombre)
    if(!error){
        const producto = {
            id: productos.length + 1,
            nombre: req.body.nombre
        }
        productos.push(producto)
        res.send(producto) 
    }else{
        const mensaje = error.details[0].message
        res.status(400).send(mensaje)
    }
    return
})

ruta.put('/:id', (req, res) => {

    let producto = existeProducto(req.params.id)
    if (!producto){
        res.status(404).send('El producto no se encuentra')
        return
    }

    //validar si el dato recibido es correcto
    const {error, value} = validarProducto(req.body.nombre)
    if(!error){
        //Actualiza el nombre
        producto.nombre = value.nombre
        res.send(producto)
    }else{
        const mensaje = error.details[0].message
        res.status(400).send(mensaje)
    }
    return
})

ruta.delete('/:id', (req, res) => {
    const producto = existeProducto(req.params.id)
    if(!producto){
        res.status(404).send('El producto no se encuentra')
        return
    }
    //encontrar el indice del usuario
    const index =  productos.indexOf(producto)
    productos.splice(index, 1) //elimina el usuario en elindice

    res.send(producto)//Se responde con el usuario eliminado
    return
})


function existeProducto(id){
    return productos.find(p => p.id === parseInt(id))
}

function validarProducto(nom){
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    })

    return schema.validate({nombre: nom})
}

module.exports = ruta 