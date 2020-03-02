const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const Usuario = require('../models/usuario')
const { verifyToken, verifyRole } = require('../middlewares/middleware')
const _ = require('underscore')



//VerifiyToken es una funcion Middleware en middleware.js que verifica nuestro token

app.get('/usuario', verifyToken, (req, res) => {

    let from = req.query.from || 0
    let limit = req.query.limit || 2

    from = Number(from)
    limit = Number(limit)
    console.log(limit);
    //===================================
    // Funcion Count nos regresa la cantidad de registros en MongoDB.
    // Usuario.count({}, (err, count) => {

    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         })
    //     } else {

    //         res.json({
    //             ok: true,
    //             count
    //         })
    //     }

    // })
    //==================================

    //{}...Nos da todos los registros 'nombre email' unicamente esos campos... limit es cant de registros
    //y skip desde que registro 
    Usuario.find({ estado: true }, 'nombre email estado ').limit(limit).skip(from).exec((err, usuarios) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        } else {

            res.json({
                ok: true,
                usuarios
            })
        }
    })


})



app.post('/usuario', [verifyToken, verifyRole], (req, res) => {
    //res.json('post usuario');
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 15),
        role: body.role,


    })



    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        } else {
            res.json({
                ok: true,
                usuarioDB
            })
        }
    })

})

app.delete('/usuario/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id

    //======================
    //Borramos el registro completamente de la BD
    // Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {
    //     if (err || !usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             error: {
    //                 message: ' Usuario no Existe o error en eliminar favor verificar'
    //             }
    //         })



    //     } else {

    //         res.json({
    //             ok: true,
    //             usuarioBorrado
    //         })
    //     }

    // })
    //===================================================

    //En vez de borrar ponemos el estado en falso de dicho id en ruta delete
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            })
        } else {
            res.json({
                ok: true,
                usuarioBD
            })
        }

    })


})

app.put('/usuario/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id

    //UnderScore Lib que nos permitira modificar desde body unicamente esos parametros de Model
    let body = _.pick(req.body, ['nombre',
            'email',
            'img',
            'estado',
            'role'
        ]



    )


    //new: Muestra el documento despues de haber sido actualizado y runValidators: pone uniqueValidatorMail y enum Roles
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            res.status(404).json({
                ok: false,
                error: err


            })

        } else {

            res.json({
                ok: true,
                Usuario: usuarioDB

            })


        }
    })

})


module.exports = app