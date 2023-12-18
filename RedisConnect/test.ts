//my idea of a test is just to connect.. if anything sup, test go fail

import RedisClientPromise from ".";
import assert from "assert";

let redisClient:Record<string, any>; //gon be set after first test
const key:string = "test-kinikur", value:string = "random"; //for testing if redis idan is active

describe("RedisConnect", () => {
	
	after(async () => {
		await redisClient.del(key);
	});

	before((done: () => void) => {
		RedisClientPromise.then(client => {
			redisClient = client;
			done();
		}).catch(done);
	});
	
	it("works", async () => {
		await redisClient.set(key, value);
		//next, asserting
		const result:string = await redisClient.get(key);
		assert.equal(result, value);
	});
});