START TRANSACTION;

CREATE SCHEMA IF NOT EXISTS user_kini;

CREATE TABLE IF NOT EXISTS user_kini.users (
	email VARCHAR(40) NOT NULL,
	display_name VARCHAR(40),
	password TEXT NOT NULL,
	password_salt TEXT NOT NULL,
	CONSTRAINT users_pk PRIMARY KEY(email), /*adds unique index to it*/
	CONSTRAINT valid_email CHECK (email ~ '.+@.+\.(com|org|edu)')
);

SAVEPOINT user_schema_done;

CREATE SCHEMA IF NOT EXISTS file;

/*I should put an index on the prmary keys of file.templates and file.template_keywords,
since according to Alan Beaulieu, any column that id referenced as foreign kry,
must havr an index... however, being primary keys, they already got unique indexes*/

CREATE TABLE IF NOT EXISTS file.templates (
	template_id SERIAL,
	poster_email VARCHAR(40) NOT NULL,
	plp_id TEXT NOT NULL, /*for id of the actual plp file*/
	thumbnail_id TEXT NOT NULL, /*for id of the image thumbnail file*/
	template_title VARCHAR(60) NOT NULL,
	template_description TEXT,
	CONSTRAINT templates_pk PRIMARY KEY(template_id),
	CONSTRAINT poster_email_fk FOREIGN KEY(poster_email) REFERENCES user_kini.users(email)
);

SAVEPOINT file_schema_checkpoint_one;

CREATE SCHEMA IF NOT EXISTS keyword;

CREATE TABLE IF NOT EXISTS keyword.template_keywords ( /*omo, denormalization wan wound me ohh*/
	keyword_id SERIAL,
	keyword VARCHAR(20),
	CONSTRAINT template_keywords_pk PRIMARY KEY (keyword_id)
);
/*to make sure same keyword don't enter this mofo twice*/
CREATE UNIQUE INDEX keyword_unique_idx ON keyword.template_keywords(keyword);

CREATE TABLE IF NOT EXISTS keyword.template_and_keyword (
	template_id INTEGER NOT NULL,
	keyword_id INTEGER NOT NULL,
	CONSTRAINT template_id_fk FOREIGN KEY (template_id) REFERENCES file.templates(template_id),
	CONSTRAINT keyword_id_fk FOREIGN KEY (keyword_id) REFERENCES keyword.template_keywords(keyword_id)
);


/*testing... gon put some random kini in the relations*/
INSERT INTO user_kini.users (email, display_name, password, password_salt)
VALUES ('themanprvnce@gmail.com', 'User X', 'randomkini', 'randomsalt');

/*creating apparent templates post*/
INSERT INTO file.templates (poster_email, plp_id, thumbnail_id, template_title, template_description)
VALUES ('themanprvnce@gmail.com', 'adaf3243q3asdfasdf23432434adfasdfauuu', 'adaf3243q3asdfasdf23432434adfasdfauuu', 'Church Flyer', 'Church flyer in Pixellab');

INSERT INTO file.templates (poster_email, plp_id, thumbnail_id, template_title, template_description)
VALUES ('themanprvnce@gmail.com', 'adaf3243q3asdfasdf23432434adfasdfauuu', 'adaf3243q3asdfasdf23432434adfasdfauuu', 'Party poster', 'Party poster in Pixellab');