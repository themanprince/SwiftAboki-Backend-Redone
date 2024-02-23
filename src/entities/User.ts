import {Entity, PrimaryColumn, Column, OneToOne, JoinColumn} from "typeorm";
import {Person} from "./Person";

@Entity({schema: "sa_data"})
export class User {
	
	@PrimaryColumn("varchar", {length: 50})
	user_name!: string;
	
	@OneToOne(type => Person)
	@JoinColumn()
	personal_details: Person;
	
	@Column("boolean")
	is_merchant: boolean = false;
	
	@Column("bytea")
	profile_pic: Object;
	
	//TODO - create Account model to connect this mofo to
	
}