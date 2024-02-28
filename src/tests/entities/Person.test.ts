import connectionPromise from "../../services/ORMConnect";
import {getConnection} from "typeorm";
import {Person} from "../../entities/";
import fillPerson from "../test-writing-assist-functions/fillPerson";
import assert from "assert";

describe("Person", () => {
	
	let connection, email = "test@gmail.com";
	
	before(async () => {
		connection = await connectionPromise;
	});
	
	//wont be focusing much on the tests, I'm just trying to do a basic folder structure
	//will focus on details later
	it("saves with no issue", async () => {
		const person = new Person();
		person.email = email;

		/*const {fname, mname, lname, country, state, city, gender, phone_no, password};
		person.fname = fname;
		person.lname = lname;
		person.mname = mname;
		person.country = country;
		person.state = state;
		person.city = city;
		person.gender = gender;
		person.password = password;
		person.phone_no = phone_no;
		*/
		
		fillPerson(person);
		
		await connection.manager.save(person);
	});
	
	it("exists after creation", async () => {
		const personRepo = connection.manager.getRepository(Person);
		
		const person = await personRepo.findOne({
			where: {email}
		});

		assert.ok(!!person);
		assert.equal(person.email, email);
	});
});