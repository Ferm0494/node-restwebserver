const express = require('express');
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')
const app = express();
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
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





module.exports = app