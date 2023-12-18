const RedisClientPromise = require(__dirname + "/../../RedisConnect");

async function logout(req, res) {
	//this outta gone thru my... express' JSON parse
	const {normalID, rfrshID}{"normalID": string, "rfrshID": string} = req.body;
	try {
		const redisClient:Record<string, any> = await RedisClientPromise;
		await redisClient.del(normalID);
		await redisClient.del(rfrshID);
		
		res.status(200).end();
	} catch(err) {
		res.status(500).send(err);
	}
}

module.exports = logout;
export default logout;