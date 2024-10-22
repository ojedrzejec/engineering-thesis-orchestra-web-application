-- CREATE DATABASE orchestras;

CREATE TABLE orchestra (
	id uuid primary key,
	name text NOT NULL,
	logo text,
	email text,
	address text,
	history text,
	facebook_url text,
	instagram_url text,
	youtube_url text
);

CREATE TABLE orchestra_member (
	id uuid primary key,
	email text NOT NULL,
	password text NOT NULL,
	first_name text NOT NULL,
	last_name text NOT NULL,
	phone text NOT NULL,
	birth_date date NOT NULL DEFAULT current_date,
	are_you_student boolean NOT NULL,
	university text,
	profile_picture text,
	description text
);

CREATE TABLE orchestra_orchestra_member (
	id_orchestra uuid references orchestra(id),
	id_orchestra_member uuid references orchestra_member(id),
	is_owner boolean NOT NULL,
	is_manager boolean NOT NULL,
	primary key (id_orchestra, id_orchestra_member)
);

CREATE TABLE instrument (
	id uuid primary key,
	id_orchestra_member uuid references orchestra_member(id) NULL,
	name text NOT NULL
);

CREATE TABLE orchestra_group (
	id uuid primary key,
	id_orchestra uuid references orchestra(id) NOT NULL,
	name text NOT NULL
);

CREATE TABLE orchestra_group_orchestra_member (
	id_orchestra_group uuid references orchestra_group(id),
	id_orchestra_member uuid references orchestra_member(id),
	primary key (id_orchestra_group, id_orchestra_member)
);

CREATE TABLE concert (
	id uuid primary key,
	id_orchestra uuid references orchestra(id) NOT NULL,
	name text NOT NULL,
	date date NOT NULL DEFAULT CURRENT_TIMESTAMP,
	time time NOT NULL DEFAULT CURRENT_TIMESTAMP,
	place text NOT NULL,
	description text,
	reservation_url text,
	graphic text
);

CREATE TABLE piece_of_music (
	id uuid primary key,
	title text NOT NULL,
	composer text NOT NULL
);

CREATE TABLE concert_piece_of_music (
	id_concert uuid references concert(id),
	id_piece_of_music uuid references piece_of_music(id),
	order_piece integer NOT NULL,
	primary key (id_concert, id_piece_of_music)
);

CREATE TABLE audience_opinion (
  id uuid primary key,
  description text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_TIMESTAMP,
  nick_or_name_surname text NOT NULL
);

CREATE TABLE concert_audience_opinion (
  id_concert uuid references concert(id),
  id_audience_opinion uuid references audience_opinion(id),
  opinion_timestamp timestamp NOT NULL,
  primary key (id_concert, id_audience_opinion)
);

CREATE TABLE piece_of_music_orchestra_group (
	id_piece_of_music uuid references piece_of_music(id),
	id_orchestra_group uuid references orchestra_group(id),
	pdf_music_sheet_notes text NOT NULL,
	primary key (id_piece_of_music, id_orchestra_group)
);

CREATE TABLE orchestra_member_concert_availability (
    id_orchestra_member uuid references orchestra_member(id),
    id_concert uuid references concert(id),
    is_available BOOLEAN NULL,
    PRIMARY KEY (id_orchestra_member, id_concert),
);
