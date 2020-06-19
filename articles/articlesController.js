const express = require('express');
const router = express.Router();

router.get('/articles', (req, res) => {
	res.send("This is an Articles Page");
});

router.get("/admin/articles/new", (req, res) => {
	res.send("<h1>Successfully created</h1>");
});

module.exports = router;