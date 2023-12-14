//this type is for the class specification that will be passed to classFormer factory function
export interface Arg { //the nature of the object I'm expecting in my factory function argument
	colNames: string[];
	neccessary: string[]; //the cols/props we can't save without
	regexToVal: RegExp; //regexToVal to val is short for "regex to validate with", it gon check that in the builder, if a string is passed(which repr the primary key with which to load all other kini into the obj),
	//then that string must match this regex..
	tableName: string; //in form of "schema.tableName"
	pKeyColName: string; //the name of the primary key column
	preSaveFunc?: () => Promise<any>; //omo, na function ohh, my guy... I nur know as I wan take specify am abeg...
	// this function will be called before saving, in cases where isSaved is false
};


//this is the type of result objects from DB queries
export type AnyObj = Record<string, any>;