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

// REGISTER
app.get("/register", function(req, res) {
    res.render("register", {
        layout: "main"
    });
});

app.post("/register", function(req, res){
    console.log(req.body);
// check the required fields
// IF all fields are filed out, send data to database (table users), hash the password and redirect them to petition
// database sends back the users ID as a cookie
    if (req.body.first && req.body.last && req.body.email && req.password){
        //db.register(req.body.first, req.body.last, req.body.email, req.password);
        res.redirect("/petition");
       
    } else {
        res.render('register', {
            layout: "error",
        });
    }});

// USER PROFILE
app.get("/profile", function(req, res) {
    res.render("user_profiles", {
        layout: "main"
    });
});

/*
app.post("/profile", function (req, res){
    if (req.session.age || req.session.city || req.session.url){
// put data in new table users_profile
    });
});*/



//LOGIN
app.get("/login", function(req, res) {
    res.render("login", {
        layout: "main"
    });
});


// EDITING PROFILE
app.get("/edit", function(req, res) {
    res.render("editing", {
        layout: "main"
    });
});



// GET PETITION//
app.get("/petition", function(req, res) {
    res.render("petition", {
        layout: "main"
    });
});

// POST PETITION
app.post("/petition", function(req, res) {
    console.log(req.body);
    if (!req.body.first || !req.body.last ||!req.body.signURL) {
        res.render("petition",{
            err: "All fields are required",
            layout: "main" 
        });
    }
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




// SHOW ALL SIGNERS OF THE PETITION
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