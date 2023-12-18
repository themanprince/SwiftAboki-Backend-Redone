import {NLO} from "../my_types";

async function loginBeforeTest(email, password) {
	const {SERVER_URL} = process.env;
	const url:string = `${SERVER_URL}/login`;
	const reqOptions:NLO<string> = {
		"method": "POST",
		"headers": {
			"Content-Type": "application/json"
		},
		"body": JSON.stringify({email, password})
	};
	
	const result:Response = await fetch(new Request(url, reqOptions));
	const kini:Record<string, string> = await result.json();
	
	return kini;
}

module.exports = loginBeforeTest;
export default loginBeforeTest;