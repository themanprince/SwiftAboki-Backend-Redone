//this gon help me grep for a particular text.. go down specified level of directories
//and find all files that contain the kini I want

//some needed modules
const {EventEmitter} = require('events');
const {stat, readdir, readFile} = require('fs/promises');

const emitUsageError = new EventEmitter(); //more like DRY on suits

emitUsageError.on("e duh be ohh", (extraKini) => {
	console.error("WRONG OR MISSING REQUIRED PARAMS");
	if(extraKini !== undefined)
		console.error(extraKini);
	else
		console.error(`(USAGE) whichofuna -l [number of dir levels to go] -t [text to search all files for]`);

	process.exit(2);
});


//parsing arguments
const allowedArgs = ["-l" /*level of deeping to go*/, "-t" /*text to search for*/];
const args = {};
const neededArgs = process.argv.slice(2); //excluding shi like "node whichofuna".. need only neededArgs

for(let i = 0 ; i < neededArgs.length; i++) {
	const curr = neededArgs[i];
	if(allowedArgs.indexOf(curr) !== -1)
		args[curr] = neededArgs[++i]; //so it'd skip the next one
	else
		emitUsageError.emit("e duh be ohh");
}

if(Object.keys(args).length < allowedArgs.length)
	emitUsageError.emit("e duh be ohh");
//one more thing... wanna make sure -l is a number 
if( ! parseInt(args["-l"]))
	emitUsageError.emit("e duh be ohh", "arg '-l' must be a number");

//next is a recursive function to get me all files as deep as '-l' parameter specifies
async function findAll(curr_dir, max_level, curr = 0 /*curr depth asin directory depth.. what level are we in*/) {
	let arr = []; //to contain all files gotten from this dir and its children
	
	//wanna exclude the 'node_modules' folder so as to improve search speed
	if(curr_dir.match(/.*node_modules.*/))
		return [];
	
	const dirFiles = [], fileFiles = []; //store paths of subdirectories and sub files separately
	const allFiles = await readdir(curr_dir);
	for(let file of allFiles.map(file => `${curr_dir}/${file}`)) { //separating sheep from the goats
		if((await stat(file)).isDirectory())
			dirFiles.push(file);
		else if((await stat(file)).isFile())
			fileFiles.push(file);
		//no 'else' block.. any other thing in the dir can fuck itself
	}
	fileFiles.forEach(file => arr.push(`${file}`)); //mak I add em to what is to be returned first.. 'member we after fileFiles
	//next, we'll go recursive if we haven't reached directory nesting limit
	if(curr < (max_level - 1))
		for(let file of dirFiles) {
			const result = await findAll(`${file}`, max_level, curr + 1);
			//I didn't do curr_dir/file because that has already been done
			//in that loop that separates fileFiles from dirFiles
			arr = [...arr, ...result];
		}
	
	return arr;
}

//next, gon be 'grepping' using that func I created that can be exported
console.log();
console.log("args is", args);
console.log();
console.log("NOTE: Search is actually case-insensitive");
console.log("loading...");
console.log();

findAll('.', args['-l']).then(async (list) => {
	let toReturn = [];
	
	for(let file of list) {
		//gon be matching only .js modules for now.. feel free to extend this CLI
		if(file.match(/(\.js)$/)) {
			const kini = await readFile(file, 'utf-8');
			if(kini.toLowerCase().includes(args["-t"].toLowerCase()))
				toReturn.push(file);
			
		}
	}
	
	return toReturn.join("\n") || "No Results";
}).then(console.log); //I dey print am