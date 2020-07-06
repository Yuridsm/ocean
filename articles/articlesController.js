const express = require('express');
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

router.get('/admin/articles', adminAuth ,(req, res) => {
	Article.findAll({
		include: [{model: Category}]
	}).then(articles => {
		res.render("admin/articles/index", {
			articles: articles
		});
	});
});

router.get("/admin/articles/new", adminAuth, (req, res) => {
	Category.findAll().then(categories => {
		res.render("admin/articles/new", { categories: categories });
	});
});

router.post("/articles/save", adminAuth ,(req, res) => {
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

router.post("/articles/delete", adminAuth, (req, res) => {
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

router.get("/admin/articles/edit/:id", adminAuth ,(req, res) => {
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

router.post("/articles/update", adminAuth ,(req, res) => {
	let id = req.body.id;
	let title = req.body.title;
	let body = req.body.body;
	let category = req.body.category;
	Article.update({
		title: title, 
		body: body, 
		categoryId: category, 
		slug: slugify(title) 
	}, { where: {id: id} }).then(() => {
		res.redirect("/admin/articles");
	}).catch(err => {
		res.redirect("/");
	});

});


router.get("/articles/page/:num", (req, res) => {
	let page = req.params.num; //17 pages
	let offset = 0;
	if(isNaN(page) || page <= 1) {
		offset = 0;
	} else {
		offset = (parseInt(page) -1)*4;
	}

	Article.findAndCountAll({
		limit: 4,
		offset: offset,
		order: [['id', 'DESC']]
	}).then(articles => {
		let next;

		/**
		 We are verifying whether the amount of last page plus 4 is more than total
		 amount of articles.
		*/
		if(offset + 4 >= articles.count) {
			next = false;
		} else {
			next = true;
		}

		let result = {
			currentPageNumber: parseInt(page),
			next: next,
			articles: articles
		}

		Category.findAll().then(categories => {
			res.render("admin/articles/page", {
				result: result,
				categories: categories
			});
		});
	});
});
module.exports = router;
