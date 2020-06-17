const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const connection = require('./database/database');

// Static
app.set(expres.static('public'));

// View engine
app.set("view engine", "ejs");

// Body parser
app.use(bodyParser.urlencoded({entends: false}));
app.use(bodyParser.json());

connection
	.authenticate()
	.then(() => {
		console.log('Connection successfully');
	})
	.catch((errorMsg) => {
		console.log(errorMsg)
	})

app.get("/", (req, res) =>{
	res.render("index");
});

app.listen(8080, () => {
	console.log("The server is running <3");
})