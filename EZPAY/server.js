/**
 * http://usejsdoc.org/
 */
//Imports
const express =require('express')
const app=express()
const mongoose=require('mongoose')
const bodyParser = require("body-parser");
const async=require('async')
let ejs = require('ejs')

//DataBase Setup
mongoose.connect('mongodb://localhost/EZPAY',{useNewUrlParser:true})
const db=mongoose.connection
 db.on('error',(error)=> console.error())
db.once('open', () => console.log('data base connected'))

//Static Files
app.use(express.static('public'))
app.use('/css',express.static(__dirname + ('public/css')))
app.use('/js',express.static(__dirname + ('public/js')))
app.use('/img',express.static(__dirname + ('public/img')))

//views

app.set('views','./views')
app.set('view engine','ejs')


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


//Server connect
app.listen(3000, ()=> console.log('Server Started'))
app.use(express.json())

const customerRoutes=require('./routes/customer')
app.use('/customer',customerRoutes)


console.log("getting started")