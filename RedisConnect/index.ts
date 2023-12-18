const {createClient} = require("redis");
//.env config outta been called by dotenv.config()
const REDIS_HOST:string = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT:number = parseInt(process.env.REDIS_PORT || "6379");

const client:Record<string, any> = createClient(REDIS_PORT, REDIS_HOST);

client.on("connect", () => console.log("Redis idan is active!"));
client.on("ready", () => console.log("Redis idan is ready ohh"));
client.on("error", err => {
	throw new Error("Redis Nur Connect Ohh, error is\n" + err);
});
/*didn't want to explicitly throw the err since normal nodejs behavior required that the err be thrown if no error callback,
however, redis does this thing were it continuously throws the error time-and-again.. I nur geh time to browse so I hope this solves it*/

const redisClientPromise /*IIFE*/ = (async () => await client.connect())();

export default redisClientPromise;
module.exports = redisClientPromise;