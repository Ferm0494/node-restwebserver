//MiddleWare for Routes of API
const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const path = require('path')
    // parse application/x-www-form-urlencoded BodyParser
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json BodyParser
app.use(bodyParser.json())

//Middleware to use Public Folder

app.use(express.static(path.resolve(__dirname, '../public')))




app.use(require('./routes'))
app.use(require('./login'))


module.exports = app