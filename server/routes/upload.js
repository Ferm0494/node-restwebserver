const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()
const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const fs = require('fs')
const path = require('path')




//Middleware for FileUpload

app.use(fileUpload())

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "No se encontro nigun archivo..."
            }
        })
    } else {
        //Validdando que unicamente el tipo sea usario || producto
        let tiposPermitidos = ['Productos', 'Usuarios']
        if (tiposPermitidos.indexOf(tipo) < 0) {
            return res.status(400).json({
                ok: false,
                error: "Ingresar un Tipo  valido..." + tiposPermitidos.toString()

            })


        }



        //form-data = archivo 
        let sampleFile = req.files.archivo;


        //Convertimos en un array la string separado por el punto.
        let archivoArray = sampleFile.name.split('.')
        let extension = archivoArray[archivoArray.length - 1];
        //Validacion de formato de archivo
        let extensionesPermitidas = ['jpg', 'gif', 'pdf', 'png', 'jpeg']



        //Si encontramos la extension en nuestro array nos dara un index
        if (extensionesPermitidas.indexOf(extension) < 0) {

            return res.status(400).json({
                ok: false,
                error: "Ingresar una extesion valida...",
                input: extension
            })

        }
        if (tipo === 'Usuarios') {
            modImgUsuario(id, res, archivoArray[0], extension, sampleFile)
        } else if (tipo === 'Productos') {
            modImgProd(id, res, archivoArray[0], extension, sampleFile)


        }
    }



})

function modImgUsuario(id, res, name, extension, sampleFile) {
    Usuario.findById(id, (err, usuarioDB) => {

        if (err || !usuarioDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: ' User Not found'
                }

            })
        } else {
            borrarArchivo(usuarioDB.img, 'Usuarios')

            usuarioDB.img = `${name}-${new Date().getMilliseconds()}_${id}.${extension}`;
            usuarioDB.save((err, userModified) => {
                if (err) {
                    return res.status(404).json({
                        ok: false,
                        message: 'Couldnt be Modified..'

                    })
                } else {

                    //Renombramos nuestra imagen para que sea unica...
                    let nameOfFile = usuarioDB.img

                    sampleFile.mv(`uploads/Usuarios/${nameOfFile}`, (err) => {
                        if (err) {
                            return res.status(401).json({
                                ok: false,
                                err
                            })

                        } else {

                            return res.json({
                                    ok: true,
                                    message: 'User Modified IMG.'
                                })
                                //Nuestra imagen fue guardad en la carpeta uploads.


                        }
                    })




                }

            })

        }
    })


}

function modImgProd(id, res, name, extension, sampleFile) {

    Producto.findById(id, (err, prodDB) => {
        if (err || !prodDB) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: 'No se encontro ningun Producto..' + err

                }
            })

        } else {

            borrarArchivo(prodDB.img, 'Productos')
            prodDB.img = `${name}-${new Date().getMilliseconds()}_${id}.${extension}`

            prodDB.save((err, newProd) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        error: {
                            message: 'No se pudo guardad producto...'
                        }

                    })
                } else {
                    let file = prodDB.img
                    sampleFile.mv(`uploads/Productos/${file}`, (err) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                error: 'No se pudo guardad producto en carpeta' + err
                            })
                        } else {
                            return res.json({
                                ok: true,
                                newProd
                            })

                        }
                    })


                }

            })


        }

    })


}

function borrarArchivo(img, tipo) {
    let archivo = path.resolve(__dirname, `../../uploads/${tipo}/${img}`)
    console.log('Path:' + archivo);

    if (fs.existsSync(archivo)) {
        console.log('entramos');
        fs.unlinkSync(archivo)

    }


}

module.exports = app