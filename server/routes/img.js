const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const { verifyImgToken } = require('../middlewares/middleware')


app.get('/img/:tipo/:img', verifyImgToken, (req, res) => {
    let tipo = req.params.tipo
    let img = req.params.img
    let route = path.resolve(__dirname, `../../uploads/${tipo}/${img}`)

    console.log(route);


    if (fs.existsSync(route)) {
        res.sendFile(route)

    } else {

        res.sendFile(path.resolve(__dirname, '../assets/no-img.png'))
    }


})

module.exports = app;