const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;



//Types of Roles dnde roles sera nuestro validator....

let roles = {
        values: ['USER_ROLE', 'ADMIN_ROLE'],
        message: '{VALUE} el rol no es valido'

    }
    //Schema for Mongoose. (usuarios)
let usuarioSchema = new Schema({
    nombre: {

        type: String,
        required: [true, 'El nombre es necesario']
    },

    email: {
        unique: true,
        type: String,
        required: [true, 'El Email es necesario']

    },

    password: {
        type: String,
        required: [true, 'La contrasena es necesaria']

    },

    img: {
        type: String,
        required: false,

    },

    role: {
        type: String,
        default: 'USER_ROLE',
        enum: roles
    },

    estado: {
        type: Boolean,
        default: true

    },

    google: {
        type: Boolean,
        default: false
    }

})

//metodo que nos permitira NO Mostrar password, pero si se guaradar en bd req.body.password
// field en JSON..
usuarioSchema.methods.toJSON = function() {
    let user = this
    let userObject = user.toObject()
    delete userObject.password;



    return userObject;

}


//Validando que el campo sea unico donde este attr unique:true,
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' })
module.exports = mongoose.model('usuario', usuarioSchema)