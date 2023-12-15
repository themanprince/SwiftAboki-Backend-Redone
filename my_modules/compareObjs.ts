//I HAD TO SAY THIS... THE NAME OF THIS MODULE IS compareObjs, I SAVED IT AS compareOb.js
//yes, I like it

//this module is for one comparison like that wey I dey do for my unit tests...
//in which I have to compare two objects with both primitive and array properties
const assert = require("assert"); //ofc.. like I said, its for tests

module.exports = function(first:Record<string, any>, second:Record<string, any>, toExclude:string[]) {
	//first must be the one that you want to compare with
	//while seccond one can be the secondary which is expected to match the first one
	//toExclude is an array of prpoperties that can be exccused... they don't have to exist in second one
	for(let key of Object.keys(first)) {
		if((toExclude !== undefined) && (toExclude.find(el => key == el)))
			continue;
		
		assert.ok(key in second);
		
		if(Array.isArray(first[key])) {
			assert.equal(second[key].length, first[key].length);
			assert.ok(first[key].every((val) => second[key].find(secOne => secOne === val)));
		} else
			assert.equal(second[key], first[key]);
	}

}