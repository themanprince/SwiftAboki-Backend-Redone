import User from "../../models/User";
import RedisClientPromise from "../../RedisConnect";
import dotenv from "dotenv";
import assert from "assert";
//tyes
import {AnyObj, NLO} from "../../my_types";
//my kini
const clearSchemaAfterTest = require(__dirname + "/../../my_modules/clearSchemaAfterTest");

dotenv.config();

const email:string = "testemail@gmail.com", display_name:string = "That Ex", password:string = "birkin collection";

const {SERVER_URL} = process.env;

const url:string = `${SERVER_URL}/login`, optionsTemplate:Readonly<Record<string, any>> = Object.freeze({
	"headers": {
		"Content-Type": "application/json"
	},
	"method": "POST"
});

//helper... I be lazy
const makeOptions = (email:string, password:string) => {
	return {
		...optionsTemplate,
		"body": JSON.stringify({email, password})
	}
};


describe("/login", () => {
	before(async () => {
		//saving a random user first
		const user:InstanceType<typeof User> = await User.builder({email, display_name, password});
		await user.save();
	});
	
	after(async () => await clearSchemaAfterTest());
	
	it("returns 400 for unexisting email", async () => {
		const options:NLO<string> = makeOptions("randomuser@gmail.com", "123");
		const result:Response = await fetch(new Request(url, options));

		assert.equal(result.status, 400);
		
		const errorObj:Record<string, string> = await result.json();
		assert.match(errorObj.error, /don\'t.*exist.*db/i);
	});
	
	it("returns 400 for wrong password", async () => {
		const options:NLO<string> = makeOptions(email, "123");
		const result:Response = await fetch(new Request(url, options));
		
		assert.equal(result.status, 400);
		
		const errorObj = await result.json();
		assert.match(errorObj.error, /password.*invalid/i);
	});
	
	it("returns 200 for correct kini", async () => {
		const options:NLO<string> = makeOptions(email, password);
		const result:Response = await fetch(new Request(url, options));
		
		assert.equal(result.status, 200);
	});
	
	it("returns tkns in resonse json", async () => {
		const options:NLO<string> = makeOptions(email, password);
		const result:Response = await fetch(new Request(url, options));
		const json:Record<string, string> = await result.json();

		const keysWeExpect:Readonly<Array<string>>/*from last two tests*/ = Object.freeze(["rfrshTkn", "rfrshID", "normalTkn", "normalID"]);

		assert.ok(keysWeExpect.every(kini => ((kini in json) && (!!json[kini]))));
	});
	
	it("caches tkns id for correct kini", async () => {
		const redisClient:AnyObj = await RedisClientPromise;
		const options:NLO<string> = makeOptions(email, password);
		const result:Response = await fetch(new Request(url, options));
		const json:Record<string, string> = await result.json();
		const {normalID, rfrshID} = json;
		
		//checking they exist in cache DB.. by checking if the value they hold is nur empty
		const cache_normalTkn:string = await redisClient.get(normalID);
		const cache_rfrshTkn:string = await redisClient.get(rfrshID);
		
		assert.ok((!!cache_rfrshTkn) && (!!cache_normalTkn));
		
	});
});