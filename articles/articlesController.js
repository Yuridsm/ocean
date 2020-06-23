const express = require('express');
const router = express.Router();
const Category = require("../categories/Category");

router.get('/articles', (req, res) => {
	res.send("This is an Articles Page");
});

router.get("/admin/articles/new", (req, res) => {
	Category.findAll().then(categories => {
		res.render("admin/articles/new", { categories: categories });
	});
});

module.exports = router;