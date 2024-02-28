import {Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, OneToOne, JoinColumn} from "typeorm";
import Person from "./Person";

@Entity({schema: "sa_data"})
export default class User {
	
	@PrimaryGeneratedColumn()
	user_id: number;
	
	@OneToOne(type => Person, {cascade: true})
	@JoinColumn()
	personal_details: Person;
	
	@Column("boolean")
	is_merchant: boolean = false;
	
	@Column("bytea", {nullable: true})
	profile_pic: Object;
	
	//TODO - create Account model to connect this mofo to
	
}