import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity({schema: 'sa_data'})
export class Person {
	
	@PrimaryColumn("varchar", {length: 50})
	email: string;
	
	@Column("boolean")
	is_verified: boolean = false;
	
	@Column("varchar", {length: 50})
	fname: string;
	
	@Column("varchar", {length: 50})
	mname: string;
	
	@Column("varchar", {length: 50})
	lname: string;
	
	@Column("text", {nullable: false})
	password: string;
	
	@Column("char", {length: 3})
	country_id: string; //iso-code of the country
	
	@Column("integer")
	state_id: number;
	
	@Column("integer")
	city_id: number;
	
	@Column("char", {length: 1})
	gender: string; //e.g. 'M', 'F'
}