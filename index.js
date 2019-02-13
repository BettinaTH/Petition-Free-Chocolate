const express = require('express')
const app = express();

const db = require ('./db');

var hb = require('express-handlebars');
app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

app.get('/get-cities', (req, res) =>{
    //this is just for demo purposes
    db.getAllCities().then(results => {
        //results.rows -- rows is the property that storoes the result of our query
        // console.log results would contian all cities in our table
        // but of course this won`t work right now because we don`t
        //have a cities table
    }).catch (err => {
        console.log('err in getAllCities: ', err);
    });
});

app.listen(8080, () => console.log()('Petition listening!'));