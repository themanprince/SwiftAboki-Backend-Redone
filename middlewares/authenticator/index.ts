const jwt = require("jsonwebtoken");
const RedisClientPromise = require(__dirname + "/../../RedisConnect");
//types
import {AnyObj, Obj, Func, FuncArray, NLO} from "../../my_types";

let redisClient; //will be initialised in main authenticator func

const checkerFuncs:FuncArray<any, Promise<boolean>> = [], returningFuncs:FuncArray<any, Promise<boolean>> = [];

//NOTE: all funcs gon return true/false depending on whether they passed or not

//if a checkerFuncs is failed, it just goes req.isLoggedIn = false
//and then goes to next middleware/route
//prolly user didn't have to be logged in to carry out operation
//e.g. downloading template

//however if a returningFuncs func is failed, it won't go on....
//it gon return 403 (unuthorized) to client.. most likely due to expired/invalid tokens

/* before anything, here's my attempt at lil' caching...
because different functions gon need the token value,
so I ain't gon re-get it each time.. sho get?
*/
type possibeKini = "normalTkn" | "tknDetails";
interface ReqIsNec/*cessary*/ {
	"req": AnyObj,
	[keys: string]: any,
};

//an IIFE
const getKini = (function(kini: possibeKini) {
	const store:{[key in possibeKini]: null | string | Obj<string>} = {
		"normalTkn": null,
		"tknDetails": null
	};

	return async function(params: ReqIsNec/*obj literal*/): (Promise<string | Obj<string> | null>) {
		if(!!store[kini]) //if isset
			return store[kini]; //return early
		
		const {req} = params; //neccessary param
		
		switch(kini) {
			case "normalTkn":
				const authHeaderStr:string = req.headers.auth;
				let tkn:string = store["normalTkn"] = authHeaderStr.split(" ")[1];
				return tkn;
				break; //no need for this apparently
			case "tknDetails":
				const {normalTkn, normalKey}:typeof params = params;
				return await new Promise((resolve, reject) => {
					jwt.verify(normalTkn, normalKey, (err:Error, decoded:AnyObj) => {
						if(err)
							return reject(err);
						
						store["tknDetails"] = decoded;
						resolve(decoded); //like I said
					});
				});
				
				break;  //no need for this too
			default:
				throw new TypeError("How tf did you get passed ts");
		}
	}
});
//the specific caches
const getNormalToken = getKini(<possibeKini>"normalTkn");
const getTokenDetails = getKini(<possibeKini>"tokenDetails");

//FIRST checkerFuncs
async function normalID_is_valid(req) {
	//I expect normalID in "custom" header, if you logged in
	const {normalID}:Obj<string> = req.headers;
	if (!(normalID))
		return false;
	
	const exists:boolean = !!(await redisClient.get(normalID));
	return exists;
}

async function normalTkn_is_sent(req) {
	const normalTkn:string = (<string>await getNormalToken(<ReqIsNec>{req}));
	return (!!(normalTkn));
}

//NEXT, returningFuncs
//returningFuncs must be run in this order

async function normalTkn_is_valid(req) {
	const normalTkn:string = (<string>await getNormalToken(<ReqIsNec>{req}));
	const {normalID}:Obj<string> = req.headers;
	//getting your key
	const normalKey:string = await redisClient.get(normalID);
	//next, gon try to verify the jsonwebtoken
	try {
		await getTokenDetails(<ReqIsNec>{req, normalKey, normalTkn});
		return true;
	} catch(err:any) {
		if(err.name === "JsonWebTokenError")
			return false;
		
		console.error("Prince, one kain error duh sup for verifying jwt ohh(for returningFuncs)");
		throw err; //mah know wetin sup
	}
}

//ADDING FUNCS TO THEY RESPECTIVE KINI
checkerFuncs.push(normalID_is_valid);
checkerFuncs.push(normalTkn_is_sent);
returningFuncs.push(normalID_is_valid);

//authenticator
async function authenticator(req, res, next) {
	redisClient = await RedisClientPromise;

	//checkerFuncs
	for(let func of checkerFuncs) {
		if( ! (await func(req))) { //if returns false
			req.isLoggedIn = false;
			return /*early*/ next();
		}
	}
	
	//returningFuncs
	for(let func of returningFuncs) {
		const result:boolean = await func(req);
		if( ! (result))
			return /*early*/ res.status(401/*invalid tokens*/).send({"error": "refresh normal tokens"});
	}
	
	//got here means you logged in... wooooo!!
	req.isLoggedIn = true;
	//user details for saving user info
	req.userKini = await getTokenDetails({req}); //outta been cached at this point... ijn
	
	next(); //we done
}