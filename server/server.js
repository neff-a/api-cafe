require('../config/config')

const mongoose = require('mongoose');
const express = require('express')
const app = express()
const path = require('path')

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json());

// static page
app.use(express.static(path.resolve(__dirname, '../public')));

// api
app.use(require('./controllers/indexController'))

 // mongose 

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then();

 
app.listen(process.env.PORT, () => {
})