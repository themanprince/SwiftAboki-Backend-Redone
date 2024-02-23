import {createConnection} from "typeorm";
import "reflect-metadata";

export default /*just cus I feel like showing myself*/ (async function createAndShareConn() {
	let connection;
	
	connection = createConnection();
	return connection;
})();