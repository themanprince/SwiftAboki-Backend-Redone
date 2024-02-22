import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import redisClientPromise from "../RedisConnect";

//dotenv
dotenv.config();

const app:Record<string, any> = express();

app.set("PORT", process.env.PORT || 8080);

//express middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": false}));


app.listen(app.get("PORT"), () => console.log("Idan is active expressly"));