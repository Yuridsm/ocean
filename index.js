const express = require('express');
const app = express();

app.get("/", (req, res) {
	res.send("starting")
});

app.listen(8080, () => {
	console.log("The server is running <3");
})