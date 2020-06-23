const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const connection = require('./database/database');
const path = require('path');

//Importing Controllers
const categoriesController = require('./categories/categoriesController');
const articlesController = require('./articles/articlesController');

//Importing Models
const Article = require('./articles/Article');
const Category= require('./categories/Category');

// Static
app.use(express.static('public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use(express.static(__dirname + '/node_modules/jquery/dist/'));

// View engine
app.set("view engine", "ejs");

// Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

connection
	.authenticate()
	.then(() => {
		console.log('Connection successfully');
	})
	.catch((errorMsg) => {
		console.log(errorMsg)
	})

app.use('/', categoriesController);
app.use('/', articlesController);

app.get("/", (req, res) =>{
	res.render("index");
});

app.listen(3000, () => {
	console.log("The server is running <3");
});