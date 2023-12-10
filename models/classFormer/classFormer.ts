//this is what I'd call a "class factory"... it gon accept certain param and form a class...
//searched the internet and there was nothing like a class factory, just object factory
//so I had to name it "classFormer"... it transforms(classforms) params to classes that can be instanstiated

//to think that classes are actually functions in js.. so my classFormer is actually a functionFormer
//nah, I'll keep the pun

//SO THIS BAD BOY GENERATES MY MODEL CLASSES
//SINCE THEY BOTH CARRY OUT THE BASIC FUNCTIONALITY OF SAVING AND LOADING USERS...
//ANY ANORMALIES TO THIS BEHAVIOUR GON' BE ADDED BY THE ANOMALOUS CLASS

const hasNeccessaryProps = require(__dirname + "/../../my_modules/hasNeccessaryProps");
const pool = require(__dirname + "../Pool.js");
const assert = require("assert");

interface Arg { //the nature of the object I'm expecting in my factory function argument
	colNames: string[],
	neccessary: string[], //the cols/props we can't save without
	regexToVal: RegExp, //regexToVal to val is short for "regex to validate with", it gon check that in the builder, if a string is passed(which repr the primary key with which to load all other kini into the obj),
	//then that string must match this regex..
	tableName: string, //in form of "schema.tableName"
	pKeyColName: string, //the name of the primary key column
	preSaveFunc: any //omo, na function ohh, my guy... I nur know as I wan take specify am abeg...
	// this function will be called before saving, in cases where isSaved is false
};

module.exports = function(classSpec: Arg) :any { //this arg(classSpec) right here, is why I installed typescript after all these years and will prolly add it to my stack
	//classSpec stands for class specifications.. which are the specific kini to do in the class
	//gon be returning the class... factoriedizationalised... yes, I said it!!
	return class TheClass {
		#isSaved: boolean;
		
		constructor(isSaved:boolean, obj: any) { //obj gon contain properties to fill 'this' with
			if((isSaved === undefined) || (obj === undefined))
				throw new ReferenceError("How yu take instantiate this class sef? say you nur supply proper args... Better use builder my friend");
			
			this.#isSaved = isSaved;
			
			for(let key of Object.keys(obj))
				this[key] = obj[key];
			
		}
		
		static async builder(arg: (string | any)) :Promise<TheClass> {
			//arg could be a string or an object...
			//if user passes string, it means they want to load an existing kini from DB into this obj's instance
			//else if they pass an object literal, its usually cus they want to save all properties of that obj into DB as single row entry in a specific table
			
			//before going on, lemme get some kini from classSpec
			const {regexToVal, colNames, tableName, pKeyColName}: Arg = classSpec;
			
			switch((typeof arg).toLowerCase()) {
				case 'string':
					
					assert(regexToVal.test(arg)); //user of factory function wants that the string passed(for loading kini from DB), must be of the form that matches regular expression regexToVal
					
					const queryStr:string = `
						SELECT ${colNames.join(", ")}
						FROM ${tableName}
						WHERE ${pKeyColName} = $1;
					`;
					
					const result:any = await pool.query(queryStr, [arg]);
					const {length} = result.rows;
					if(length === 0)
						return null;
					else
						return new TheClass(true, result.rows[0]); //true is to signify that the kini been saved before
				
					break;
				case 'object':
					if(Array.isArray(arg))
						throw new TypeError("arg to builder func, should not be an array you fat bitch");
					
					return new TheClass(false, arg); //we good, 'false' is to signify that kini ain't been saved before
					break;
				default:
					throw new TypeError("arg to builder func, must either be string or object");
			}
		}
		
		set = (prop, value) :void => { //omo, e shock me say I actually use this method ohh... copied it from LifeLog Server
			prop = prop.toLowerCase(); //yes... and so what if this is all I do here
			
			this[prop] = value;
		}
		
		get canSave() :boolean {
			const {neccessary}:Arg = classSpec;
			return hasNeccessaryProps(this, neccessary);
			//a.k.a... we can save only if we have what we need to save with
		}
		
			
		save = async () => {
			//this handles both fresh saves and updates
			if(! this.canSave)
				throw new Error("Cannot save or update object to DB. it lacks some useful properties");
			//asin nur move forward at all
			
			const {colNames, tableName}: Arg = classSpec; //will be used by both branches of the condition
			
			//note the ! below
			if(!this.#isSaved) {
				//its a fresh save
				
				const {preSaveFunc}: Arg = classSpec;
				//if a function was specified for making changes to 'this' before I save it, I'm gon run it
				// e.g. in User model, it gon hash password and add hash and salt to 'this'
				if(preSaveFunc)
					await preSaveFunc.call(this);
				
				//inserting into DB next
				
				const queryStr:string = `
				INSERT INTO ${tableName} (${colNames.join(", ")})` + //this line is sumn' like "INSERT INTO user_kini.users (email, user_id, age)"
				`VALUES (${colNames.map((col, idx) => "$" + (idx + 1))});`; //this line is sumn' like "$1", "$2", "$3"
	
				try {
					//the values for each of the columns 'posed to come from 'this', since we store all kini in this, before attempting to save... so I'mma obtain em
					const result:any = await pool.query(queryStr, colNames.map(col => this[col]) /*got them*/);
					
					//only changing isSaved when this shi successfully saved
					this.#isSaved = true;
					
					return result;
				} catch (err) {
					throw new Error("error in saving, error details are\n" + err);
				}
			} else {
				//its an update
				const {pKeyColName}: Arg = classSpec;
				
				const queryStr:string = `
				UPDATE ${tableName}
				SET
					${colNames.map((col, idx) => `${col} = ${idx + 1}`).join(", ")}` + //this line is sumn' like "email = $1, age = $2"
				`WHERE ${pKeyColName} = $${colNames.length + 1};`; //this line means I'll be supplying an extra substitution, cus I don't know the idx of the primary key column in colNames
				//I used colNames.length + 1, so that it will take the last position after all colNames vals have entered... in the newly formed array
				try {
					const result:any = await pool.query(queryStr, [...colNames.map(col => this[col]) , this[pKeyColName]]);
					return result;
				} catch(err) {
					throw new Error("Error in updating in DB, error is\n" + err);
				}
			}
			
		}

		static async exists(kini) {
			//this takes a value
			//then searches if there is any row with the value of 'kini' for the primary key in table called tableName
			//e.g. it can check if there's a user with email equal to 'kini' (i.e. email is the primary key for the users table)
			const {tableName, pKeyColName} : Arg = classSpec;
			const queryStr:string = `
				SELECT
					CASE
						WHEN EXISTS (SELECT * FROM ${tableName} WHERE ${pKeyColName} = $1)
						THEN 1
						ELSE 0
					END AS "exists";
			`;
			
			try{
				const result: any = await pool.query(queryStr, [kini]);
				const num: number = parseInt(result.rows[0]["exists"]);
				switch(num) {
					case 1:
						return true;
						break;
					case 0:
						return false;
						break;
					default:
						throw new Error("Abeg I duh understand ohh");
				}
			} catch (err) {
				throw new Error(`An error occured in checking if row exists in ${tableName}, with ${pKeyColName} of ${kini}\n` + err);
			}
		}
		
	}
}