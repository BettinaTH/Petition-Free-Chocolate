const express = require('express');
const app = express();
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const csurf = require('csurf');
const db = require ('./db');

/// HANDLEBARS DO NOT TOUCH CODE BELOW /////
var hb = require('express-handlebars');
app.engine('handlebars', hb());
app.set('view engine', 'handlebars');
app.use(function (req, res, next) {
    console.log(req.url);
    next();
});
/// HANDLEBARS DO NOT TOUCH CODE ABOVE /////

// COOKIE SESSION
app.use(cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14 // Cookies lasts 2 weeks
}));

app.use(bodyParser.urlencoded({
    extended: false
})
);

app.use(csurf());

app.use(function(req, res, next) {
    res.setHeader("X-Frame-Options","DENY")
    res.locals.csrfToken = req.csrfToken();
    next();
});

//app.use(cookieParser());



// LINK TO THE CSS
app.use(
    express.static('./public')
);


// GET PETITION//
app.get("/petition", function(req, res) {
    res.render("petition", {
        layout: "main"
    });
});

// GET THANKS //
app.get("/thanks", function(req, res) {
    res.render("thanks", {
        layout: "main"
    });
});

// GET SIGNERS //
app.get("/signers", function(req, res) {
    res.render("signers", {
        layout: "main"
    });
});



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

app.listen(8080, () => console.log('Petition listening!'));