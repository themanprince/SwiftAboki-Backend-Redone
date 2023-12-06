const express = require("express");

const app = express();

app.set("PORT", process.env.PORT || 8080);

app.get("/", function(req, res, next) {
	res.write("One");
	next();
});

app.get("/", function(req, res, next) {
	res.write("two");
	res.end();
});

app.listen(app.get("PORT"), () => console.log("Idan is active expressly"));