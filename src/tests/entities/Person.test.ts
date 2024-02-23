import connectionPromise from "../../services/ORMConnect";
import {getConnection} from "typeorm";
import {Person} from "../../entities/Person";
import assert from "assert";

describe("Person", () => {
	
	let connection;
	
	before(async () => {
		connection = await connectionPromise;
	});
	
	//wont be focusing much on the tests, I'm just trying to do a basic folder structure
	//will focus on details later
	it("saves with no issue", async () => {
		const person = new Person();
		person.email = "test@gmail.com"
		person.fname = "Test";
		person.lname = "User";
		person.mname = "MF";
		person.country_id = "NGA";
		person.state_id = 1;
		person.city_id = 1;
		person.gender = "M";
		person.password = "123";
		await connection.manager.save(person);
	});
	
	it("exists after creation", async () => {
		const result = await connection.manager.find(Person);
		
		assert.ok(result.length > 0);
	});
});