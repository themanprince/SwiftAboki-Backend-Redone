//this route named login is actually for boiling beans and making garri

const pathToRoot = "../..";

import {AnyObj} from "../../my_types";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {EventEmitter} from "events";
//my redis client for caching
import redisClientPromise from "../../RedisConnect";

const errorHandler:EventEmitter = new EventEmitter(); //for server errors
errorHandler.on("error", (res:Record<string, any>/*response object*/, err:Error /*error object*/) => {
	console.error("Prince, an error occured, error details are\n\n", err);
	res.status(500).send(err);
});

async function login (req, res) {
	const {email, password} = req.body;
	
	//gon check if this an actual User
	if( ! (await User.exists(email)))
		return res.status(400).send({"error": "Email don't exist in my DB"});
	
	if( ! (await User.isPasswordValid(email, password)))
		return res.status(400).send({"error": "Password invalid. You dey try tiff account bah?"});
	
	//got here, so gon' grant User access
	//LL jwt model
	const userKini:AnyObj = await User.builder(email);
	const normalOptions:AnyObj = {
		"expiresIn": 900 //15mins
	};
	const rfrshOptions:AnyObj = {
		"expiresIn": 1500 //25mins
	};
	/*next secret keys and IDs*/
	const normalKey:string = crypto.randomUUID(),
		normalID:string = crypto.randomUUID(),
		rfrshKey:string = crypto.randomUUID(),
		rfrshID:string = crypto.randomUUID();
	
	//first getting a non-sensitive version of this user kini to send 'em
	//...gon work cus there is a toJSON() in User class that gon give me cleanVersion
	const cleanVersion:Record<string, string> = JSON.parse(JSON.stringify(userKini));
	//generating tokens
	jwt.sign(cleanVersion, normalKey, normalOptions, (err:Error, normalTkn:string) => {
		if(err) {
			errorHandler.emit("error", res, err);
			return;
		}		
		//signing refresh token
		jwt.sign({}, rfrshKey, rfrshOptions, async (err:Error, rfrshTkn:string) => {
			if(err) {
				errorHandler.emit("error", res, err);
				return;
			}
			
			//so login successful.. gonna send user they tokens
			res.status(200).send({
				normalTkn, normalID, rfrshTkn, rfrshID
			});
			
			//next is caching tkns in map to they IDs
			try {
				const redisClient:AnyObj = await redisClientPromise;
				await redisClient.set(normalID, normalKey);
				await redisClient.set(rfrshID, rfrshKey);
			}catch(err:any) {
				errorHandler.emit("error", res, err);
			}
		});
	});
}

module.exports = login;
export default login;