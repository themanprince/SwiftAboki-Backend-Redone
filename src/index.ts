import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";

//dotenv
dotenv.config();

async function main() {
  try {
	const app = express();
	
	app.set("PORT", process.env.PORT || 8000);
	//express middlewares
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({"extended": false}));
	
	app.listen(app.get("PORT"), () => console.log("Idan is active expressly"));
	
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

// Call the main function to start the application
main();