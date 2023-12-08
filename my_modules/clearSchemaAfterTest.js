const pool = require(__dirname + "/../Pool.js");

module.exports = async function() {
	const dropQuery /*to undo commit*/ = `
		DROP SCHEMA user_kini CASCADE;
		DROP SCHEMA file CASCADE;
		DROP SCHEMA keyword CASCADE;`;
	await pool.query(dropQuery);
}