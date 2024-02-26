import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity({schema: 'sa_data'})
export class Person {
	
	@PrimaryColumn("varchar", {length: 50})
	email: string;
	
	@Column("text")
	password: string;
	
	@Column("boolean")
	is_verified: boolean = false;
	
	@Column("varchar", {length: 50})
	fname: string;
	
	@Column("varchar", {length: 50})
	mname: string;
	
	@Column("varchar", {length: 50})
	lname: string;

	@Column("char", {length: 3})
	country: string; //iso-code of the country
	
	@Column("integer")
	state: number;
	
	@Column("integer")
	city: number;
	
	@Column("char", {length: 1})
	gender: string; //e.g. 'M', 'F'
	
	@Column("varchar", {length: 15})
	phone_no: string;
}