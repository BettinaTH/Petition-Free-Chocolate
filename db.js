var bcrypt = require('bcryptjs');

var spicedPg = require('spiced-pg');


var db = process.env.DATABASE_URL || spicedPg('postgres:postgres:postgres@localhost:5432/wintergreen-petition');

/* This QUERY is just for Demo purpose


module.exports.addCity = function addCity(city, state, country) {
    db.query(
        'INSERT INTO cities (city, state, country) VALUES ($1, $2, $3)',
        [ city, state, country ]
    );
};*/

// USER REGISTER //
module.exports.register = function register(first, last, email, password){
    return db.query('INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id',
        [first, last, email, password]);
};


// USER ADDS MORE PROFILE 
module.exports.moreProfile = function moreProfile(age, city, url, user_id){
    return db.query('INSERT INTO users_profile(age, city, url, user_id) VALUES ($1, $2, $3, $4)', [age, city,url, user_id]);
};

// checkin 
module.exports.checkLogin = function checkLogin(email){
    return db.query('SELECT first, last, email, password, users.id, signature.id AS signed FROM users LEFT JOIN signature ON signature.user_id=users.id WHERE email=$1', [email]);
};
// check Password 
module.exports.checkPassword = function checkPassword(textEnteredInLoginForm, hashedPasswordFromDatabase) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(textEnteredInLoginForm, hashedPasswordFromDatabase, function(err, doesMatch) {
            if (err) {
                reject(err);
            } else {
                resolve(doesMatch);
            }
        });
    });
};

// STORE THE USER ID AND SIGNATURE TO TABLE signatrure
module.exports.submitPetition = function submitPetition(signURL, user_id) {
    return db.query('INSERT INTO signature (signURL, user_id) VALUES ($1, $2)', [signURL, user_id]);
};

// Show all signers 
module.exports.allSigners = function allSigner(){
    return db.query('SELECT first, last, age, city, url FROM signature LEFT JOIN users ON users.id=signature.user_id LEFT JOIN users_profile ON users.id=users_profile.user_id'); 
};

// Show all signers by city
module.exports.sameCity = function sameCity(city){
    return db.query('SELECT first, last, age, url FROM signature LEFT JOIN users ON users.id=signature.user_id LEFT JOIN users_profile ON users.id=users_profile.user_id WHERE city=$1',[city]);
};

// show signature image
module.exports.showSignature = function showSignature(user_id){
    return db.query('SELECT signURL FROM signature WHERE user_id=$1', [user_id]);
};

//DELETE Signature
module.exports.deleteSignature = function deleteSignature(user_id){
    return db.query('DELETE * FROM signature WHERE user_id=$1');
};

// EDITING Profile
module.exports.showFullProfile = function showFullProfile (user_id){ 
    return db.query('SELECT first, last, age, city, url, password, email FROM users LEFT JOIN users_profile ON users.id=users_profile.user_id WHERE user_id=$1', [user_id]);
};

module.exports.updateProfile = function updateProfile (first, last, email, age, city, url, user_id){
    return db.query('INSERT first, last, email, age, city, url FROM users LEFT JOIN users_profile ON users.id=users_profile.user_id VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (user_id) DO UPDATE SET first = $1, last = $2, email = $3, age = $4, city = $5, url=$6 ',[first, last, email, age, city, url, user_id]);
};
module.exports.updateProfilePW = function updateProfilePW (first, last, email, password, age, city, url, user_id){
    return db.query('INSERT first, last, email, password, age, city, url FROM users LEFT JOIN users_profile ON users.id=users_profile.user_id VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (user_id) DO UPDATE SET first = $1, last = $2, email = $3,  password = $4, age = $5, city = $6, url=$7 ',[first, last, email, password, age, city, url, user_id]);
};

