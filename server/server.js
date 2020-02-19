const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


//Port and BD global on config
require('./config/config')


// parse application/x-www-form-urlencoded BodyParser
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json BodyParser
app.use(bodyParser.json())

//MiddleWare for Routes

app.use(require('./routes/routes'))

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