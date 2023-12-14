const classFormer/*factory func*/ = require(__dirname + "/../classFormer");
import {Arg, AnyObj} from "../../my_types";
const bcryptjs = require("bcryptjs");
const pool = require(__dirname + "/../../Pool.js");

function doPasswordKini(this: AnyObj) { //action to be done before saving User for first time
	return new Promise((res, rej) => {
		bcryptjs.genSalt(6, (saltErr: Error, password_salt: string) => {
			if(saltErr)
				return rej(saltErr);
			
			//this function will be bound to object,
			//so 'this' gon refer to the obj... I got a set method there
			this.set("password_salt", password_salt);
			
			bcryptjs.hash(this.password, password_salt, (hashErr: Error, hash: string) => {
				if(hashErr)
					return rej(hashErr);
				//next is, replacing intially set password with the hash so I can store it
				this.password = hash;
				
				res(this.password);
			});
		});
	});

}

/*next, my class specifications for creating the class from factory func*/
const myClassSpec: Arg = {
	"colNames": ["email", "display_name", "password", "password_salt"],
	"neccessary": ["email", "display_name", "password"],
	"regexToVal": /.+@.+\.(com|org|edu)/,
	"tableName": "user_kini.users",
	"pKeyColName": "email",
	"preSaveFunc": doPasswordKini
};

//next, the class
const User = classFormer(myClassSpec);

//next, one unique static method that should belong only to User model..
//think of this like extending a class... lol
User.isPasswordValid = (email: string, pass: string) => new Promise((res, rej) => {
	const queryStr: string = `
		SELECT password_salt, password FROM user_kini.users
		WHERE email = $1;
	`;
	
	pool.query(queryStr, [email], (err: Error, result: AnyObj) => {
		if(err)
			return rej(err);
		
		if(result.rows.length === 0)
			return rej(new TypeError(`Email '${email}' don't exist in my DB`));
		
		const {password_salt, password} = result.rows[0];
		bcryptjs.hash(pass, password_salt, (err: Error, hash: string) => {
			if(err)
				return rej(err);
			
			if(hash === password)
				res(true);
			else
				res(false);
		});
	});
});

module.exports = User;
export default User;