const express = require('express')
const Producto = require('../models/producto')
const app = express()
const { verifyToken } = require('../middlewares/middleware')
const Categoria = require('../models/categoria')


//Listar todos los productois paginados..
app.get('/productos', verifyToken, (req, res) => {

    //Paginacion
    let from = req.query.from || 0;
    let limit = req.query.limit || 3;


    from = Number(from);
    limit = Number(limit)


    console.log(`from: ${from} y limit: ${limit}`);


    //Poulmaos FK usuario y categoria y paginas 3 
    Producto.find({}).populate('categoria').
    populate('usuario').skip(from).limit(limit)
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            } else {
                return res.json({
                    ok: true,
                    productos

                })

            }

        })

})

app.get('/productos/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id).populate('usuario').populate('categoria')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })

            } else {
                return res.json({
                    ok: true,
                    producto
                })

            }

        })



})


app.post('/productos', verifyToken, (req, res) => {

    //categoria lo sacaremos de body pero veremos su id en find
    let categoria = req.body.categoria

    //Buscamos tal categoria si existe..
    Categoria.findOne({ descripcion: categoria }, (err, categoria) => {

        if (err || !categoria) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Problemas con base de datos o no se encontro categoria favor revisar....'
                }
            })

        } else {
            //de verify token
            let usuarioId = req.usuario._id
            let idOfCategoria = categoria._id;
            let producto = new Producto({
                nombre: req.body.nombre,
                precioUni: req.body.precioUni,
                descripcion: req.body.descripcion,
                disponible: req.body.disponible,
                categoria: idOfCategoria,
                usuario: usuarioId


            })


            producto.save((err, newProducto) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'No se pudo guardar producto...'
                    })
                } else {
                    return res.json({
                        ok: true,
                        categoria: 'Producto creado'
                    })

                }

            })



        }
    })




})

app.put('/productos/:id', verifyToken, async(req, res) => {
    let id = req.params.id
    let body = req.body

    //Vemos si tenemos categoria....
    //Si tenemos categoria en body haceemos la conversion de la descripcion a su ID para luego
    // asignarlo a body.categoria = ID
    //find() nos devuelve todo el documento de Mongo , pero en el 2nd param { _id: 1, descripcion: 1 }
    //Espeficiamos que unicamente queremos esos 2 campos y luego nos escupe un arreglo de 1 posicion...
    //Obtenemos lo que queremos con body.categoria[0].(value)
    if (body.categoria) {

        body.categoria = await Categoria.find({ descripcion: body.categoria }, { _id: 1, descripcion: 1 }, (err, categoria) => {
            //console.log('Category' + categoria.toString().length);
            if (err || categoria.toString().length === 0) {


                return res.status(401).json({
                    ok: false,
                    err: {
                        message: err || 'No se encontro categoria o problema con bd...'
                    }
                })
            } else {
                console.log('Se encontro Cat con ese nombre!');

            }
        })

        body.categoria = body.categoria[0]._id
    }




    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }).exec((err, prodUpdated) => {
        if (err || !prodUpdated) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Problemas con BD o con Usuario no encontrado...' + err
                }
            })

        } else {
            return res.json({
                ok: true,
                prodUpdated,
            })
        }

    })

})

app.delete('/productos/:id', verifyToken, (req, res) => {
    let id = req.params.id
    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true }).exec(
        (err, prodUpdated) => {
            if (err || !prodUpdated) {
                return res.status(401).json({
                    ok: false,
                    err: {
                        message: 'Problemas con BD o con Usuario no encontrado...'
                    }
                })

            } else {
                return res.json({
                    ok: true,
                    prodUpdated,
                })
            }





        }
    )


})

app.get('/productos/buscar/:termino', verifyToken, (req, res) => {
    let termino = req.params.termino;
    //Ocupamos una expresion regular RegExp(req.params.termino, 'i'), donde 'i' significa 
    //que no importa si es minuscula o mayuscula
    let regex = new RegExp(termino, 'i');
    //{ disponible: true, nombre: regex } == unicamente mosotramos disp: true y nombre que se parezcan a regex
    //{ nombre: 1 }== unicamente mostramos los nombres y por defecto tambien nos muestra el id
    Producto.find({ disponible: true, nombre: regex }, { nombre: 1 }, (err, productos) => {
        if (err || productos.toString().length === 0) {
            return res.status(401).json({
                ok: false,
                error: {
                    message: err || 'No se encontro ningun producto...'
                }
            })

        } else {
            return res.json({
                ok: true,
                productos
            })

        }

    })

})



module.exports = app