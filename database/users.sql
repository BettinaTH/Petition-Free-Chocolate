DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS signature;

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
    user_id INT NOT NULL REFERENCES users(id)
    );