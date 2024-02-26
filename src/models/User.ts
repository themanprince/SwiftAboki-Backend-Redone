import {Person} from "../entities/Person";
import connectonPromise from "../services/ORMConnect";


interface userProps { //for checking what user lasses
	email: string;
	
	password: string;
	
	is_verified: boolean;
	
	fname: string;
	
	mname: string;
	
	lname: string;

	country: string; //iso-code of the country
	
	state: number;

	city: number;
	
	gender: string; //e.g. 'M', 'F'
	
	phone_no: string;
	
	is_merchant: boolean;
}

export default class User {
	
	/*protected allowedProps = {
		"ownDetails": ["is_merchant"],
		"personalDetails": ["email", "password", "is_verified", "fname", "lname", "mname", "country", "state", "city", "gender", "phone_no"]
	};
	*/
	constructor(props: userProps) {
		/*const allAllowedProps = Object.keys(allowedProps).reduce((allProps, propArr) => allProps.concat(propArr), []);
		//didnt hard code the concatenation cus the keys may change tomorrow
		*/
		for(let propKey of Object.keys(props)) {
			/*if(allAllowedProps.indexOf(propKey) < 0)
				throw new SyntaxError(`SA - A prop you supplied, (${propKey}) is not supported`);
				//'SA' is to denote error was thrown by SA dev
			*/
			
			//adding user details to 'this'
			this[propKey] = props[propKey];
		}
		
		
		this.save = this.save.bind(this);
	}
	
	save() {
		
	}
}