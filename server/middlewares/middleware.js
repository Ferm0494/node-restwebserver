const jwt = require('jsonwebtoken')
require('../config/config')


const verifyImgToken = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {


        if (err) {
            return res.status(401).json({
                ok: false,
                err

            })
        } else {

            //Cuando lo hacemos post okl true usuarioDB
            req.usuario = decoded.usuarioDB
                //Google lo guarda como newUser
            if (!req.usuario) {
                req.usuario = decoded.newUser

            }


            next()

        }


    })



}

//Middleware For verifying Token used on Header---> token
const verifyToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {


        if (err) {
            return res.status(401).json({
                ok: false,
                err

            })
        } else {

            //Cuando lo hacemos post okl true usuarioDB
            req.usuario = decoded.usuarioDB
                //Google lo guarda como newUser
            if (!req.usuario) {
                req.usuario = decoded.newUser

            }


            next()

        }


    })





}




const verifyRole = (req, res, next) => {



    let role = req.usuario.role;
    console.log(`El Rol es ${req.usuario.role}`);

    if (role === 'USER_ROLE') {
        return res.status(401).json({
            ok: false,
            permission: 'Denied'

        })

    } else {
        next();
    }

}

module.exports = {
    verifyToken,
    verifyRole,
    verifyImgToken


}