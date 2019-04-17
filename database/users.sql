DROP TABLE IF EXISTS signature CASCADE;
DROP TABLE IF EXISTS users_profile CASCADE;
DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(250) NOT NULL,
    last VARCHAR(250) NOT NULL,
    email VARCHAR(250) NOT NULL UNIQUE,
    password VARCHAR(250) NOT NULL
);

CREATE TABLE signature(
    id SERIAL PRIMARY KEY,
    signURL text NOT NULL,
    user_id INT UNIQUE NOT NULL REFERENCES users(id)
    );

CREATE TABLE users_profile(
    id SERIAL PRIMARY KEY,
    age INT,
    city VARCHAR (150),
    url VARCHAR (500),
    user_id INT UNIQUE NOT NULL REFERENCES users(id)
);