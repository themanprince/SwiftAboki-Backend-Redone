const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
//my routes
const pathToRoutes = __dirname + "/routes";
const register/*route handler*/ = require(pathToRoutes + "/register");
const login = require(pathToRoutes + "/login");
const logout = require(pathToRoutes + "/logout");

//dotenv
dotenv.config();

const app:Record<string, any> = express();

app.set("PORT", process.env.PORT || 8080);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": false}));

//routes
app.post('/register', register);
app.post('/login', login);
app.post('/logout', logout);

app.listen(app.get("PORT"), () => console.log("Idan is active expressly"));