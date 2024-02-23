import {Person} from "../entities/Person";
import connectonPromise from "../services/ORMConnect";

export default async function signUp(req, res, next) {
	const {email, password, fname, mname, lname, is_verified, gender} = req.body;
	const prsn = new Person();
	prsn.email = email;
	prsn.password = password;
	prsn.fname = fname;
	prsn.mname = mname;
	prsn.lname = lname;
	prsn.gender = gender;
	prsn.is_verified = is_verified;
	
	const conn = await connectonPromise;
	
	await conn.manager.save(prsn);
	
	console.log("saved ohh... thank God");
}