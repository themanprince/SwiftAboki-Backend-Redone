//omo, this looks like it gon be a long test to write
const User = require(__dirname + "/index.js");
const pathToMyModules = __dirname + "/../../my_modules";
const clearSchemaAfterTest = require(pathToMyModules + "/clearSchemaAfterTest");
const compareObjs = require(pathToMyModules + "/compareOb.js");
const pool = require(pathToMyModules + "/../Pool.js");
const assert = require("assert");

describe("User Model", () => {
	after(async () => {
		await clearSchemaAfterTest();
	});
	
	describe("builder osim constructor", () => {
		it("loads props from args if its an obj", async () => {
			const objToArg = {
				"email": "princeadigwe29@gmail.com",
				"display_name": "your popsi",
				"password": "123",
				"password_salt": "123"
			};
			
			const userObj = await User.builder(objToArg);
			compareObjs(objToArg, userObj);
		});
		
		it("passing an unexisting email to builder returns null", async () => {
			const userObj = await User.builder("randomkinikur@yahoo.org");
			assert(userObj === null);
		});
		
		it("throw error for invalid email", async () => {
			try {
				const userObj = await User.builder("ronaldo-siuuuuu");
				throw new Error("Was supposed to fail"); //catch block will only be okay for errors with name "AssertionError"
				//so this will cause test to fail if thrown
			} catch(err) {
				assert(err.name === "AssertionError");
			}
		});
	});
	
	describe("canSave", () => {
		it("should return false for canSave() when ! canSave", async () => {
			const testUser = await User.builder({
				"email": "princeadigwe29@gmail.com",
				"password": "123"
			});
			
			assert( ! testUser.canSave);
		});
		
		it("canSave should return true when canSave", async () => {
			const testUser = await User.builder({
				"email": "princeadigwe29@gmail.com",
				"display_name": "the Man On Point",
				"password": "123"
			});
			
			assert(testUser.canSave);
		});
		
	});
	
	describe("save() itself and effects", () => {
		const email = "princeadigwe29@gmail.com", display_name = "TMP", password = "123";
		//gon save a user with these props and this gon be my kini for subsequent tests

		it("saves users", async () => {
			const user = await User.builder({email, display_name, password});
			await user.save();
			//asserting that this kini is in the dDB
			const result = await pool.query(`SELECT * FROM user_kini.users WHERE email = $1`, [email]);
			compareObjs(result.rows[0], user);
		});
		
		it("loads users details given existing email as arg to builder", async () => {
			const user = await User.builder(email);
			compareObjs({email, display_name}, user); //can't add password field, cus the one in user obj will be hashed so will nur match with simple kini above
		});
		
		it("exists() returns true for existing user", async () => {
			const exists = await User.exists(email);
			assert(exists);
		});
		
		it("exists() returns false for unexisting user", async () => {
			const exists = await User.exists("randomkinikur@gmail.com");
			assert( ! exists);
		});
		
		it("isPasswordValid() returns true for valid password", async () => {
			const passwordIsValid = await User.isPasswordValid(email, password);
			assert(passwordIsValid);
		});
		
		it("isPasswordValid() returns false for valid password", async () => {
			const passwordIsValid = await User.isPasswordValid(email, "password");
			assert( ! passwordIsValid);
		});
		
		it("isPasswordValid() throws TypeError when email don't exist", async () => {
			try {
				await User.isPasswordValid("randomkinikur@gmail.com", "123");
				throw new Error("Wasn't supposed to pass");
			} catch(err) {
				assert((err.name === "TypeError") && (err.message.match(/my.*DB/i)));
			}
		});
		
		it("updates a user if save() is called on a loaded User obj", async () => {
			//first loading the kini
			const user = await User.builder(email);
			const new_display_name = "COck SUcker";
			user.display_name = new_display_name;
			await user.save();
			//getting user from DB direct
			const fromDB = await pool.query(`SELECT * FROM user_kini.users WHERE email = $1`, [email]);
			assert(fromDB.rows[0].display_name === new_display_name);
		});
	});
});