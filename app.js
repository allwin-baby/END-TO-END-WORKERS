var express=require("express"); 
var bodyParser=require("body-parser");
var ejs = require("ejs");
var http = require('http');
var fs = require('fs');
require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose'); 
const session = require('express-session');
const app = express();


app.use(session({
    secret: "thisissessionkey",
    resave: true,
    saveUninitialized: false,
}));

/* const main = require("./router/main");
const index = require('./router/index'); */
const adminDashboard = require('./router/admin');
const edit = require('./router/edit');
const approve = require('./router/approve');
const sp = require('./router/sp');
const customer = require('./router/customer');
const emp = require('./router/emp');
const payment = require('./router/payment');


mongoose.connect('mongodb+srv://allwin:allwin1234@cluster0.lnivn.mongodb.net/Project?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("Connected to db"));
 
const registration = require("./router/registration")
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));



app.use(bodyParser.json()); 
app.use(express.static(__dirname+"/views")); 
app.use(bodyParser.urlencoded({ 
	extended: true
})); 

app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/about',(req,res)=>{
    res.render('about')
})
app.get('/logout',(req,res)=>{
    req.session.userid = null
    res.render('home')
})

app.use('/edit', edit); 
app.use('/approve', approve); 
app.use('/',registration);
/* app.use('/',main); */
app.use('/admin', adminDashboard); 
app.use('/sp', sp); 
app.use('/customer', customer); 
app.use('/emp', emp);  
app.use('/payment', payment);  





app.listen(3000);
console.log("server listening at port 3000"); 

