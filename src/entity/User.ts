import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class person {
	
	@PrimaryGeneratedColumn()
	person_id: number;
	
	@Column()
	is_verified: bool;
	
	@Column()
	fname: string;
	
	@Column()
	mname: string;
	
	@Column()
	lname: string;
	
	@Column()
	password: string;
	
	@Column()
	country_id: string; //iso-code of the country
	
	@Column()
	state_id: number;
	
	@Column()
	city_id: number;
	
	@Column()
	gender: string; //e.g. 'M', 'F'
}