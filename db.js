var spicedPg = require('spiced-pg');

var db = spicedPg('postgres:postgress:postgress@localhost:5432/wintergreen-petition');

// This QUERY is just for Demo purpose
module.exports.getAllCities = function getAllCities(){
    return db.query('SELECT * FROM cities');
};

module.exports.addCity = function addCity(city){
    db.query(
        'INSERT INTO cities (city) VALUES ($1)'),
    [ city, state ]
    )
}

app.post('/create-new-city', (req, res) =>{
    // again this
    db.addCity('Unna', 'NRW').then(() =>{

    })
})