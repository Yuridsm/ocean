const express = require('express');
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");

router.get('/admin/articles', (req, res) => {
	Article.findAll({
		include: [{model: Category}]
	}).then(articles => {
		res.render("admin/articles/index", {
			articles: articles
		});
	});
});

router.get("/admin/articles/new", (req, res) => {
	Category.findAll().then(categories => {
		res.render("admin/articles/new", { categories: categories });
	});
});

router.post("/articles/save", (req, res) => {
	let title = req.body.title;
	let body = req.body.body;
	let categoryId = req.body.category;

	Article.create({
		title: title,
		slug: slugify(title),
		body: body,
		categoryId: categoryId
	}).then(() => {
		res.redirect("/admin/articles");
	});
});

router.post("/articles/delete", (req, res) => {
	let id = req.body.id;
	if(id != undefined) {
		if(!isNaN(id)) {
			Article.destroy({
				where: { id: id}
			}).then(() => {
				res.redirect("/admin/articles");
			});
		} else {
			res.redirect("/admin/articles");
		}
	} else {
		res.redirect("/admin/articles");
	}
});

router.get("/admin/articles/edit/:id", (req, res) => {
	let id = req.params.id;
	Article.findByPk(id).then(article => {
		if(article != null) {
			Category.findAll().then(categories => {
				res.render("admin/articles/edit", {
					categories: categories,
					article: article
				});
			}).catch(err => {
				console.log("Category - Erro na rota: [/admin/articles/edit");
				res.redirect("/");
			});
		} else {
			res.redirect("/");
		}
	}).catch(err => {
		console.log("Article - Erro na rota: [/admin/articles/edit:id]");
		res.redirect("/");
	});
});

module.exports = router;
