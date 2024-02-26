import {Entity, PrimaryColumn, Column, OneToOne, JoinColumn} from "typeorm";
import {Person} from "./Person";

@Entity({schema: "sa_data"})
export class User {

	@OneToOne(type => Person)
	@JoinColumn()
	personal_details: Person;
	
	@Column("boolean")
	is_merchant: boolean = false;
	
	@Column("bytea", {nullable: true})
	profile_pic: Object;
	
	//TODO - create Account model to connect this mofo to
	
}