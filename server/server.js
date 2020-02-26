const express = require('express')
const app = express()
const mongoose = require('mongoose')

//Importing Routes from Index.js 
app.use(require('./routes/index'))


//Port and BD global on config
require('./config/config')






//MiddleWare for Routes of apis...Index En JS todas las rutas API
// app.use(require('./routes/routes'))
app.listen(process.env.PORT, () => {
    console.log('Despeglando server en...' + process.env.PORT);
})

//useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true...standard...
//


mongoose.connect(process.env.urlDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err, res) => {
    if (err) {
        throw error;
    } else {

        console.log('Base de Datos Online');
    }

})