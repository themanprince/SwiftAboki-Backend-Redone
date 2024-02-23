//gon be doing a simple validation for now as this is still
//project bootstrapping phase... or tracer-bullet dev

import addTryCatch from "../helpers/addTryCatch";
import {Person} from "../entities/Person"; //when dev starts, import User class, not Person class
import {getConnection} from "typeorm";
import signupSchema from "../request-schemas/signup";

const validateSignUpDetails = addTryCatch(async (req, res, next) => {
	//schema checking
	const {error, value} = signupSchema.validate(req.body);
	if(error)
		return res.status(400).json({"error": error.details[0].message});
	
	
	const {email} = req.body;
	
	const personRepo = getConnection().getRepository(Person);
	
	const exists = !!(await personRepo.findOne({"email": email} as any));
	
	if(exists)
		throw /*again, just for tracer codes*/ new Error("user exists");
	else
		next();
});


export default validateSignUpDetails;