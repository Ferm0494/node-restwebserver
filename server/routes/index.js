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



//Middlewares for routes of app
app.use(require('./categoria'))
app.use(require('./routes'))
app.use(require('./login'))
app.use(require('./producto'))


module.exports = app