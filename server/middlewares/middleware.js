const jwt = require('jsonwebtoken')
require('../config/config')


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
            req.usuario = decoded.usuarioDB



            next()

        }


    })





}




const verifyRole = (req, res, next) => {

    let role = req.usuario.role;
    console.log(`El Rol es ${req.usuario.email}`);

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
    verifyRole


}