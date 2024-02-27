//gon be doing a simple validation for now as this is still
//project bootstrapping phase... or tracer-bullet dev

import addTryCatch from "../helpers/addTryCatch";
import signupSchema from "../request-schemas/signup";
import User from "../models/User";

const validateSignUpDetails = addTryCatch(async (req, res, next) => {
	//schema checking
	const {error, value} = signupSchema.validate(req.body);
	
	if(error)
		return res.status(400).json({"error": error});
	
	const {email} = req.body;
	
	const exists = await User.exists(email);
	
	if(exists)
		throw new Error(`user with email (${email}) exists`);
	else
		next();
});


export default validateSignUpDetails;