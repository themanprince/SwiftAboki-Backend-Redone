const pathToHome:string = __dirname + "/../..";
const pool:Record<string, any> = require(pathToHome + "/Pool.js");
const assert = require("assert");
const dotenv = require("dotenv").config();
//helper modules
const pathToModules = pathToHome + "/my_modules";
const compareObjs = require(pathToModules + "/compareObjs");
const clearSchemaAfterTest = require(pathToModules + "/clearSchemaAfterTest");

//SERVER_URL from process.env
const SERVER_URL:string = (<string>process.env.SERVER_URL);

describe("/register route", () => {
	//first test gon save a user
	//subsequent tests gon do other kini that follow suite
	
	const email:string = "princeadigwe29@gmail.com", password:string = "123", display_name:string = 'The Man Prvnce';
	
	const options:Record<string, (string|Record<string, string>)> = {
		"method": "POST",
		"headers": {
			"Content-Type": "application/json"
		},
		"body": JSON.stringify({email, password, display_name})
	};
	const url:string = `${SERVER_URL}/register`;
	const req:Request = new Request(url, options);

	let result:Record<string, any>; //will be set after request is made
	
	before(async () => {
		//with the fetching
		result = await fetch(req);
	});
	
	after(async () => await clearSchemaAfterTest());
	
	it("returns 200 for valid user kini", async () => {
		assert.equal(result.status, 200);
	});
	
	it("contains kini in DB afterwards", async () => {
		const queryRes:Record<string, any> = await pool.query(`SELECT * FROM user_kini.users WHERE email = $1`, [email]);
		compareObjs({email, display_name}, queryRes.rows[0]);
	});
	
	it("hashes password", async () => {
		const queryRes:Record<string, any> = await pool.query(`SELECT password FROM user_kini.users WHERE email = $1`, [email]);
		const DBPassword:string = queryRes["rows"][0]["password"];
		assert.ok((DBPassword !== null) && (DBPassword !== password)); //a.k.a its not same as entered password cus it been hashed
	});
	
	it("prevents registration twice by the same user", async () => {
		//compiler said I can't reuse same Request object
		const newReq = new Request(url, options);
		const newResult:Record<string, any> = await fetch(newReq);
		
		assert.equal(newResult.status, 400);
		
		const json:Record<string, string> = await newResult.json();
		
		assert.match(json.error, /.*email.*taken/);
	});
	
	it("won't allow invalid email", async () => {
		const email:string = "princeadigwe29@"; //in scoping I trusted
		const options:Record<string, (string|Record<string, string>)> = {
			"method": "POST",
			"headers": {
				"content-type": "application/json"
			},
			"body": JSON.stringify({email, password, display_name})
		};
		const req:Request = new Request(url, options);
		
		const queryRes:Record<string, any> = await fetch(req);
		
		assert.equal(queryRes.status, 400);
		const json:Record<string, string> = await queryRes.json();

		assert.match(json.error, /.*enter.*valid.*email$/);
	});
});