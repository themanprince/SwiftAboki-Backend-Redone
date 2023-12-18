const User = require(__dirname + "/../../models/User");
const loginBeforeTest = require(__dirname + "../../my_modules/loginBeforeTest");
const clearSchemaAfterTest = require(__dirname + "/../../my_modules/clearSchemaAfterTest");

const email = "randomuser@yahoo.org", password = "23fgsf;", display_name = "Man Of The Hour";

let tokens; //gon be filled with token kini

describe("/logout route", () => {
	before(async () => {
		//gon' save and log in a random user so we can have kini to work with
		const userObj = await User.builder({email, password, display_name});
		await userObj.save();
		//next is logggin em in
		token = await loginBeforeTest(email, password);
	});
	
	after(async () => await clearSchemaAfterTest());
});