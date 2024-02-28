import {Person, User} from "../../entities/";
import connectionPromise from "../../services/ORMConnect";
import fillPerson from "../test-writing-assist-functions/fillPerson";
import assert from "assert";

let person, user, user_id, email = "random@gmail.com";

let connManager, userRepo, personRepo;

describe("User entity", () => {
	
	before( async () => {
		const conn = await connectionPromise;
		connManager = conn.manager;
		personRepo = connManager.getRepository(Person);
		userRepo = connManager.getRepository(User);

	});
	
	it("saves with no issue", async () => {
		//const {fname, mname, lname, country, state, city, gender, phone_no, password};
		const person = new Person();
		person.email = email;
		/*person.fname = "Test";
		person.lname = "User";
		person.mname = "MF";
		person.country = "NGA";
		person.state = 1;
		person.city = 1;
		person.gender = "M";
		person.password = "123";
		person.phone_no = "+2348037680836";
		*/
		
		fillPerson(person);
		await connManager.save(person);
		
		//user kini
		user = new User();
		user.is_merchant = false;
		user.personal_details = person;
		await connManager.save(user);
		
		user_id = user.user_id; //so I can confirm its been inserted
	});
	
	it("person exists in db", async () => {
		const person = await personRepo.findOne({
			where: {email}
		});

		assert.equal(person.email, email);
	});
	
	it("user exists in db", async () => {
		const user = await userRepo.findOne({
			where: {user_id}
		});

		assert.ok(!!user);
		assert.equal(user.user_id, user_id);
	});
	
	it("user is related to person", async () => {
		const user = await userRepo.find(
			{
				relations: {personal_details: true}
			},
			{
				where: {
					personal_details: {
						email
					}
				}
			}
		);
		
		assert.equal(user[0].user_id, user_id);
	});
	
});