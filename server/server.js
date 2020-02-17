const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('./config/config')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/usuario', (req, res) => {
    res.json('get Usuario')
})

app.post('/usuario', (req, res) => {
    //res.json('post usuario');
    let body = req.body;
    res.json({
        persona: body
    })

})

app.delete('/usuario', (req, res) => {
    res.json('delete usuario')
})

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id
    res.json('put usuario' + id)

})

app.listen(process.env.PORT, () => {
    console.log('Despeglando server en...' + process.env.PORT);
})