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
	Article.findAll({
		order: [
			['id', 'DESC']
		]
	}).then((articles) => {
		Category.findAll().then(categories => {
			res.render("index", { articles: articles, categories: categories });
		});
	});
});

app.get("/:slug", (req, res) => {
	let slug = req.params.slug;
	
	Article.findOne({
		where: { slug: slug }
	}).then((article) => {
		if(slug != undefined) {
			Category.findAll().then(categories => {
				res.render("article", {
					article: article,
					categories: categories
				});
			});
		} else {
			res.redirect("/");
		}
	}).catch(err => {
		res.redirect("/");
	});
});

app.get("/category/:slug", (req, res) => {
	let slug = req.params.slug;
	Category.findOne({
		where: {slug: slug},
		include: [{model: Article}]
	}).then(category => {
		if(category != undefined) {
			Category.findAll().then(categories => {
				res.render("index", {
					articles: category.articles,//Problema aqui
					categories: categories
				});
			});
		} else {
			res.redirect("/");
		}
	}).catch(err => {
		res.redirect("/");
	});
});

app.listen(3000, () => {
	console.log("The server is running <3");
});