const pool = require(__dirname + "/../../Pool.js");
const hasNeccessaryProps = require(__dirname + "/../../my_modules/hasNeccessaryProps");
const bcryptjs = require("bcryptjs");
const assert = require("assert"); //can you blame me at this point

class User { //gon be implementing builder pattern in this class
	
	#isSaved; //for telling if user is being saved to DB first time or not
		
	constructor(isSaved, obj) { //these 'posed to be passed by builder func
		this.#isSaved = isSaved;
			
		if(obj)
			for(let key of Object.keys(obj))
				this[key] = obj[key];
		else
			throw new ReferenceError("How yu take instantiate User class sef? say you nur supply obj args... Better use builder my friend");
	}
	
	static async builder(arg) {
		//arg could be a string or an object...
		//if user passess string, it means they want to load an existing user into this obj's instance
		//else if they pass an object literal, it means they want to save a new user with the object's props
		switch((typeof arg).toLowerCase()) {
			case 'string':
				//means it contain an email I should query fo'
				assert(/.+@.+\.(com|org|edu)/.test(arg)); //don't go on if we ain't got a valid email
				
				const queryStr = `
					SELECT email, display_name, password, password_salt
					FROM user_kini.users
					WHERE email = $1;
				`;
				
				const result = await pool.query(queryStr, [arg]);
				const {length} = result.rows;
				if(length === 0)
					return null;
				else
					return new User(true, result.rows[0]); //true is to signify that user been saved before
			
				break;
			case 'object':
				if(Array.isArray(arg))
					throw new TypeError("arg to builder func, should not be an array you fat bitch");
				
				return new User(false, arg); //we good, 'false' is to signify that user ain't been saved before
				break;
			default:
				throw new TypeError("arg to builder func, must either be string or object");
		}
	}
	
	set = (prop, value) => { //omo, e shock me say I actually use this method ohh... copied it from LifeLog Server
		prop = prop.toLowerCase(); //yes... and so what if this is all I do here
		
		this[prop] = value;
	}
	
	get canSave() {
		//cross-checking thru next
		const neccessary = ["email", "display_name", "password"]; //for now

		return hasNeccessaryProps(this, neccessary);
	}
	
	save = () => {
		//this handles both fresh saves and updates
		return new Promise((res, rej) => {
			if(! this.canSave)
				return rej(Error("Cannot save or update User object to DB. it lacks some useful properties"));
			//asin nur move forward at all
			
			//note the ! below
			if(!this.#isSaved) {
				//its a fresh save
				bcryptjs.genSalt(6, (saltErr, password_salt) => {
					if(saltErr)
						return rej(saltErr);
					
					this.set("password_salt", password_salt);
					bcryptjs.hash(this.password, password_salt, (hashErr, hash) => {
						if(hashErr)
							return rej(hashErr);
						//next is, replacing it with the hash so I can store it
						this.password = hash;
						//inserting into DB next
						
						const {email, display_name, password, password_salt} = this;
						/*in creating queryStr, I'm finna list out columns I'm inserting into incase changes
						are made to my db in future.. it will not insert to wrong columns*/
						const queryStr = `
						INSERT INTO user_kini.users (email, display_name, password, password_salt)
						VALUES ($1, $2, $3, $4);`;
						pool.query(queryStr, [email, display_name, password, password_salt], (err, result) => {
							if(err)
								return rej(err);
							
							//only changing isSaved when this shi successfully saved
							this.#isSaved = true;
							
							res(result);
						});
					});
				});
			} else {
				//its an update
				const {email, display_name, password, password_salt} = this;
				const queryStr = `
				UPDATE user_kini.users
				SET
					email = $1,
					display_name = $2,
					password = $3,
					password_salt = $4
					
				WHERE email = $1;`;
				pool.query(queryStr, [email, display_name, password, password_salt], (err, result) => {
					if(err)
						return rej(err);
					
					res(result);
				});
			}
		});
	}
	
	static exists(email) {
		return new Promise((res, rej) => {
			//checks if any user exists with given email
			const queryStr = `
				SELECT
					CASE
						WHEN EXISTS (SELECT * FROM user_kini.users WHERE email = $1)
						THEN 1
						ELSE 0
					END AS "exists";
			`;
			
			pool.query(queryStr, [email], (err, result) => {
				if(err)
					return rej(err); //returning early... if I went to school at all
				
				const num = parseInt(result.rows[0]["exists"]);
				switch(num) {
					case 1:
						res(true);
						break;
					case 0:
						res(false);
						break;
					default:
						rej(new Error("Abeg I duh understand ohh"))
				}
			});	
		});
	}
	
	static isPasswordValid(email, pass) {
		return new Promise((res, rej) => {
			const queryStr = `
				SELECT password_salt, password FROM user_kini.users
				WHERE email = $1;
			`;
			
			pool.query(queryStr, [email], (err, result) => {
				if(err)
					return rej(err);
				
				if(result.rows.length === 0)
					return rej(new TypeError(`Email '${email}' don't exist in my DB`));
				
				const {password_salt, password} = result.rows[0];
				bcryptjs.hash(pass, password_salt, (err, hash) => {
					if(err)
						return rej(err);
					
					if(hash === password)
						res(true);
					else
						res(false);
				});
			});
		});
	}
}

//exporting
module.exports = User;