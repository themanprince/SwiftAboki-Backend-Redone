import User/*model*/ from "../../models/User";


module.exports = async function(req, res) {
	//this outta gone thru my JSON parser
	const {email, password, display_name} = req.body;
	
	//first checking email is valid
	if( ! (email.match(/.+@.+\.(com|org|edu)/)))
		return res.status(400).send({"error": "Please enter a valid email"});
	
	//try block is for any dealings with user model
	try {
		const exists:boolean = await User.exists(email);
		
		if(exists)
			return res.status(400).send({"error": "This email is taken. Choose another"});
	
		//creating user to save
		const user:InstanceType<typeof User> = await User.builder({email, password, display_name});
	
		await user.save();
		res.status(200).end();
	} catch(AnyError: any) {
		
		res.status(500).send(AnyError);
	}
};