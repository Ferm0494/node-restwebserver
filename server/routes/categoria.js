const express = require('express');
const Categoria = require('../models/categoria')
const app = express()
const { verifyRole, verifyToken } = require('../middlewares/middleware')

//Lista todas nuestras categorias
app.get('/categoria', verifyToken, (req, res) => {
    //Unicamente listamos sin condiciones y listamos unicamente la descripcion..
    Categoria.find({}, 'descripcion').exec((err, categorias) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })

        } else {
            return res.json({
                ok: true,
                categorias

            })
        }

    })

})

//Agarra nuestra categoria por id.. y lista tanto como la descripcion y el id de user que la creo
app.get('/categoria/:id', verifyToken, (req, res) => {

    let id = req.params.id

    //Populate nos mostrara la info de ObjectID FK (usario) y el segundo campo 
    //cuales son los datos que queres mostrar, sort nos odernara de manera alfabetica 
    //por la descripcion
    Categoria.findById(id).sort('descripcion')
        .populate('usuario', 'nombre email').exec((err, categoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })



            } else if (!categoria) {
                return res.status(401).json({
                    ok: false,
                    err: {
                        message: 'No se encontro categoria'
                    }
                })


            } else {
                return res.json({
                    ok: true,
                    categoria
                })


            }



        })

})


//creamos una categoria donde id viene de verifyToken y cateogoria de el body
app.post('/categoria', verifyToken, (req, res) => {
    let id = req.usuario._id;
    let categoria = req.body.descripcion;

    //creamos la instancia
    let newCategoria = new Categoria({
        descripcion: categoria,
        usuario: id

    })

    //Guardamos la categoria...
    newCategoria.save((err, newCat) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })

        } else {

            return res.json({
                ok: true,
                newCat,
            })

        }

    })




})


//Ruta para modificar una categoria especifica.
app.put('/categoria/:id', verifyToken, (req, res) => {

    let id = req.params.id;
    let newDescripcion = req.body.descripcion;
    //Modificamos categoria por id de categoria donde usamos context: 'query' para no
    // interferi con runValidators (UniqueValidator)
    Categoria.findByIdAndUpdate(id, { descripcion: newDescripcion }, { new: true, runValidators: true, context: 'query' }).
    exec((err, updated) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })

        } else {

            return res.json({
                ok: true,
                user: updated
            })

        }

    })



})

//Ruta para borrar una cierta categoria de la bd.
app.delete('/categoria/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndDelete(id).exec((err, deletedUser) => {
        if (err || !deletedUser) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Problema con BD favor verificar...'
                }
            })

        } else {

            return res.json({
                ok: true,
                deletedUser
            })
        }

    })

})





module.exports = app