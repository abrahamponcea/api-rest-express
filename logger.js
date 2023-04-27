function log(req, res, next){
    console.log('Logging...')
    next() //Le indica a expres que llame a la siguiente funcion middlewware
    //Si no se indica se queda dentro de la funcion
}

module.exports = log;