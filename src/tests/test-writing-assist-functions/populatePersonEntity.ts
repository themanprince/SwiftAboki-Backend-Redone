export default function populatePersonEntity(person, populationData) {
	const {fname, mname, lname, country, state, city, gender, phone_no, password} = populationData;
	person.fname = fname;
	person.lname = lname;
	person.mname = mname;
	person.country = country;
	person.state = state;
	person.city = city;
	person.gender = gender;
	person.password = password;
	person.phone_no = phone_no;
}