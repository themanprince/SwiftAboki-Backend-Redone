const {Pool} = require("pg");

const pool = new Pool({
	"user": "the_man_prvnce",
	"host": "localhost",
	"database": "TMPixellab",
	"port": 5432
});

module.exports = pool;