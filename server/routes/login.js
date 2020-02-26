const express = require('express');
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')
const app = express();
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
require('../config/config')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/login', (req, res) => {

    Usuario.findOne({ email: req.body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })


        } else if (!usuarioDB) {
            return res.status(400).json({
                    ok: false,
                    error: ' User o contra incorrecta'
                }

            )
        } else if (!bcrypt.compareSync(req.body.password, usuarioDB.password)) {

            return res.status(400).json({
                ok: false,
                error: ' User o contra incorrecta'
            })
        } else {
            let token = jwt.sign({ usuarioDB }, process.env.SEED, { expiresIn: process.env.LIFE })
            res.json({
                ok: true,
                usuarioDB,
                token
            })
        }
    })




})

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload);
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return payload;
}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;


    let googleUser = await verify(token).catch(error => {
        return res.status(403).json({
            ok: false,
            error
        })
    })

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            console.log('bug1');
            //no tenemos usuario...procedemos a agregar en basde datos y a generar nuevo token;

            let usuario = new Usuario({
                nombre: googleUser.name,
                email: googleUser.email,
                password: bcrypt.hashSync(':)', 15),
                role: 'USER_ROLE',
                img: googleUser.picture,
                google: true




            })

            usuario.save((err, newUser) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                } else {
                    let token = jwt.sign({ newUser }, process.env.SEED, { expiresIn: process.env.LIFE })

                    return res.json({
                        ok: true,
                        newUser,
                        token

                    })


                }


            })




        } else if (usuarioDB.google === true) {
            console.log('bug2');
            //Usuario si existe y su metodo de autenticacion es true entonces procedemos a renovar
            //token
            let token = jwt.sign({ usuarioDB }, process.env.SEED, { expiresIn: process.env.LIFE })
            return res.json({
                ok: true,
                usuario: usuarioDB,
                token

            })

        } else {
            console.log('bug3');
            //Usuario si existe y usuarioDB.google == false
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Favor ingresar con su metodo original.'
                }
            })

        }

    })
})





module.exports = app