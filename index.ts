const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
//my modules
const register/*route handler*/ = require(__dirname + "/routes/register");

//dotenv
dotenv.config();

const app:Record<string, any> = express();

app.set("PORT", process.env.PORT || 8080);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": false}));

app.post('/register', register);

app.listen(app.get("PORT"), () => console.log("Idan is active expressly"));