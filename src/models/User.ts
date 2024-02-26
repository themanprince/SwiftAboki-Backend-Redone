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
	
	protected ourPrsn = new Person();

	constructor(props: userProps) {
		for(let propKey of Object.keys(props).map(prop => prop.toLowerCase()))
			this.ourPrsn[propKey] = props[propKey];
		
		
		this.save = this.save.bind(this);
	}
	
	async save() {
		
		const conn = await connectonPromise;
		
		await conn.manager.save(prsn);

	}
}