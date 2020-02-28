const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

let categoriaSchema = new Schema({
        descripcion: {
            type: String,
            unique: true,
            required: [true, 'La descripcion es necesaria']
        },

        usuario: {
            //Referenciando el id que tiene nuestro usuario mongoose.model('usuario',usuarioSchema)
            type: Schema.Types.ObjectId,
            ref: 'usuario'

        },


    })
    //Desc Unica
categoriaSchema.plugin(uniqueValidator, { message: 'el ${PATH} debe de ser unico' })
module.exports = mongoose.model('categoria', categoriaSchema)