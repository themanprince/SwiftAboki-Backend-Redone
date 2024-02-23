//gon be doing a simple validation for now as this is still
//project bootstrapping phase... or tracer-bullet dev

import addTryCatch from "../helpers/addTryCatch";
import {Person} from "../entities"; //when dev starts, import User class, not Person class
import {getConnection} from "typeorm";

export default const validateSignUpDetails = addTryCatch(async (req, res, next) => {
	const {email} = req.body;
	
	const conn = await connectionPromise;
	
	const personRepo = getConnection().getRepository(Person);
	
	const exists = !!(await personRepo.findOne({"email": email}));
	
	if(exists)
		throw /*again, just for tracer codes*/ new Error("user exists");
	else
		next();
});