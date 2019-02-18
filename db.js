var bcrypt = require('bcryptjs');

var spicedPg = require('spiced-pg');


var db = spicedPg('postgres:postgres:postgres@localhost:5432/wintergreen-petition');

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

// USER ADDS MORE PROFILE //
module.exports.moreProfile = function moreProfile(age, city, url, user_id){
    return db.query('INSERT INTO users_profile(age, city, url, user_id) VALUES ($1, $2, $3, $4)', [age, city,url, user_id])
};

// LOGIN STUFF //
module.exports.checkLogin = function checkLogin(email){
    return db.query('SELECT * FROM users WHERE email=$1', [email]);
};
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

// PETITION STUFF //


// STORE THE USER ID AND SIGNATURE TO TABLE signatrure
module.exports.submitPetition = function submitPetition(signURL, user_id) {
    return db.query('INSERT INTO users (sign, user_id) VALUES ($1, $2)', [signURL, user_id]);
};

// Show all *** check users_id in signature with users TABLE
module.exports.allSigners = function allSigner(){
    return db.query('SELECT * FROM users'); 
};