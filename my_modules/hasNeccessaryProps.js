//this is for checking if a certain object has all the required properties
module.exports = function(obj, neccessary) {
	//expect an array argument
	for(let shi of neccessary)
		if(!obj[shi])
			return false;
	
	return true;
}