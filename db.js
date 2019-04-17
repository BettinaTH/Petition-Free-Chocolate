var bcrypt = require('bcryptjs');

var spicedPg = require('spiced-pg');

var db = spicedPg(process.env.DATABASE_URL || 'postgres:postgres:postgres@localhost:5432/wintergreen-petition');



// REGISTRATION
module.exports.register = function register(first, last, email, password){
    return db.query('INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id',
        [first, last, email, password]);
};

// USER ADDS MORE PROFILE 
module.exports.moreProfile = function moreProfile(age, city, url, user_id){
    return db.query('INSERT INTO users_profile(age, city, url, user_id) VALUES ($1, $2, $3, $4)', [age, city,url, user_id]);
};

// LOGIN
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

// SHOW ALL SIGNERS
module.exports.allSigners = function allSigner(){
    return db.query('SELECT first, last, age, city, url FROM signature LEFT JOIN users ON users.id=signature.user_id LEFT JOIN users_profile ON users.id=users_profile.user_id'); 
};

// SHWO ALL SIGNERS BY CITY
module.exports.sameCity = function sameCity(city){
    return db.query('SELECT first, last, age, url FROM signature LEFT JOIN users ON users.id=signature.user_id LEFT JOIN users_profile ON users.id=users_profile.user_id WHERE city=$1',[city]);
};

// SHOW SIGNATURE
module.exports.showSignature = function showSignature(user_id){
    return db.query('SELECT signURL FROM signature WHERE user_id=$1', [user_id]);
};

// DELETE SIGNATURE
module.exports.deleteSignature = function deleteSignature(user_id){
    return db.query('DELETE FROM signature WHERE user_id=$1', [user_id]);
};

// EDITING PROFILE
module.exports.showFullProfile = function showFullProfile (user_id){ 
    return db.query('SELECT first, last, age, city, url, password, email FROM users LEFT JOIN users_profile ON users.id=users_profile.user_id WHERE user_id=$1', [user_id]);
};

module.exports.updateProfile = function updateProfile (first, last, email, user_id){
    return db.query(`UPDATE users SET first = $1, last = $2, email = $3
    WHERE id = $4`,[first, last, email, user_id]);
};

module.exports.updateProfilePW = function updateProfilePW (first, last, email, password, user_id){
    return db.query(`UPDATE users SET first = $1, last = $2, email = $3, password = $4
    WHERE id = $5`,[first, last, email, password, user_id]);
};

module.exports.updateMoreProfile = function updateMoreProfile(age, city, url, user_id){
    return db.query(`INSERT INTO users_profile (age, city, url, user_id)
    VALUES ($1, $2, $3, $4) ON CONFLiCT (user_id) DO UPDATE SET age = $1, city = $2, url = $3`, [age, city, url, user_id]);
};

