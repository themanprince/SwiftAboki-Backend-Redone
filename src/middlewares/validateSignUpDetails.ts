//gon be doing a simple validation for now as this is still
//project bootstrapping phase... or tracer-bullet dev

import addTryCatch from "../helpers/addTryCatch";
import {Person} from "../entities/Person"; //when dev starts, import User class, not Person class
import {getConnection} from "typeorm";

const validateSignUpDetails = addTryCatch(async (req, res, next) => {
	const {email} = req.body;
	
	const personRepo = getConnection().getRepository(Person);
	
	const exists = !!(await personRepo.findOne({"email": email} as any));
	
	if(exists)
		throw /*again, just for tracer codes*/ new Error("user exists");
	else
		next();
});


export default validateSignUpDetails;