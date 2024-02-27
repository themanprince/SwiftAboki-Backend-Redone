import {Person} from "../entities/Person";
import {User} from "../entities/User";
import connectonPromise from "../services/ORMConnect";
import {getConnection} from "typeorm";

interface userProps {
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
	
	protected ourUser = new User();

	constructor(props: userProps) {
		for(let propKey of Object.keys(props))
			this[propKey] = props[propKey];
		
		
		this.save = this.save.bind(this);
	}
	
	async save() {
		const {email, password, is_verified, fname, mname, lname, country, state, city, gender, phone_no, is_merchant} = this;
		
		const conn = await connectonPromise;
		
		const userPersonalDetails = new Person();
		
		userPersonalDetails.email = email;
		userPersonalDetails.password = password;
		userPersonalDetails.is_verified = is_verified;
		userPersonalDetails.fname = fname;
		userPersonalDetails.mname = mname;
		userPersonalDetails.lname = lname;
		userPersonalDetails.country = country;
		userPersonalDetails.state = state;
		userPersonalDetails.city = city;
		userPersonalDetails.gender = gender;
		userPersonalDetails.phone_no = phone_no;
		
		
		await conn.manager.save(userPersonalDetails);
		
		
		this.ourUser.personal_details = userPersonalDetails;
		this.ourUser.is_merchant = is_merchant;
		
		await conn.manager.save(this.ourUser);
	}
	
	static async exists(email: string) {
		const personRepo = getConnection().getRepository(Person);
		
		const exists = !!(await personRepo.findOne({email} as any));
		
		return exists;
	}
}