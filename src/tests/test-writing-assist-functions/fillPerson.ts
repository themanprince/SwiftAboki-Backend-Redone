//this fills up person entity with test-credentials/person

import populatePersonEntity from "./populatePersonEntity";
import testPersonCredentials from "../test-credentials/person";

export default function fillPerson(person) {
	populatePersonEntity(person, testPersonCredentials);
}