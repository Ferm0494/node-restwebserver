const mongoose = require('mongoose')
const Schema = mongoose.Schema

let productoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },

    precioUni: {
        type: Number,
        required: [true, 'El precio unitario es necesario']
    },

    img: {
        type: String,
        required: false,
    },

    descripcion: {
        type: String,
        required: false,

    },

    disponible: {
        type: Boolean,
        required: false,
        default: false,

    },

    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'categoria'

    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuario'

    }



})


module.exports = mongoose.model('producto', productoSchema);