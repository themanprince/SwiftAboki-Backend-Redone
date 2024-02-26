import User from "../models/User";

export default async function signUp(req, res, next) {
	//const {email, password, fname, mname, lname, phone_no, is_verified, gender, country, state, city} = req.body;
	//I expect the only content of req.body is user creation kini
	try {
		const user = new User(req.body);
		await user.save();
		res.status(200).send({"msg": "success"});
	} catch(err) {
		console.error("SA error occured, error is\n", err);
		res.status(500).send({"error": err});
	}
}