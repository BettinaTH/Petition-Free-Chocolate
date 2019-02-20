const express = require('express');
const app = express();
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const csurf = require('csurf');
const db = require ('./db');
const hashPassword = require ('./auth.js').hashPassword;



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
app.get("/register", (req, res) => {
    res.render("register", {
        layout: "main"
    });
});

app.post("/register", (req, res) =>{
    console.log("req.body:",req.body);
// check the required fields
// IF all fields are filed out, send data to database (table users), hash the password and redirect them to petition
// database sends back the users ID as a cookie
    if (req.body.first && req.body.last && req.body.email && req.body.password){
        hashPassword(req.body.password).then(hashedPassword =>{
            db.register(req.body.first, req.body.last, req.body.email, hashedPassword).then(data => {
                req.session.id = data.rows[0].id;
                req.session.first = req.body.first;
                req.session.last = req.body.last;
                req.session.email = req.body.email;
                console.log('data =>: ', data);
                res.redirect("/profile");
            }).catch ( err => {
                console.log ("app.post register: ", err);}); 
        });  
    } else {
        res.render('register', {
            layout: "error",
        });
    }});

// USER PROFILE
app.get("/profile", (req, res) => {
    res.render("user_profiles", {
        layout: "main"
    });
});
app.post("/profile", (req, res) =>{
    console.log("profile: ", req.body);
    db.moreProfile(req.body.age, req.body.city, req.body.url, req.session.id);
    res.redirect("/petition");
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
        layout: "main",
    });
});

app.post("/login", function(req, res){
    if(req.body.email && req.body.password){
        db.checkLogin(req.body.email)
            .then(profileInfo =>{
                if(profileInfo.rows[0]){
                    req.session.first = profileInfo.rows[0].first;
                    req.session.last = profileInfo.rows[0].last;
                    req.session.last = profileInfo.rows[0].email;
                    req.session.id = profileInfo.rows[0].id;
                    req.session.signed = profileInfo.rows[0].signed;
                    req.session.logedIn = true;
                    console.log('print out profileInfo: ', profileInfo);
                    console.log('req.body.password: ', req.body.password);
                    console.log('profilInfo.rows: ', profileInfo.rows[0].password); 
                    db.checkPassword(req.body.password, profileInfo.rows[0].password)
                        .then(matchingPassword => {
                            if(matchingPassword == true && req.session.signed){
                                res.redirect("/thanks");                                
                            } else if(matchingPassword == true && !req.session.signed) {
                                res.redirect("/petition");                                
                            } else {
                                res.render("login",{
                                    layout: "main",
                                    err: "ups, something went wrong, please try again."
                                });
                            }  
                        })
                        .catch(err=>{
                            console.log("error checkPassword: ", err);
                        }); 
                }
            }).catch(err =>{
                console.log('errore checkLogin: ', err)
            });
    } else {
        res.render("login", {
            layout: "main",
            err: "Ups, something went wrong, please try again."
        });
    }
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
    } else {
        //db.submitPetition(req.body.signURL, req.session.id);
        //console.log('signature: ', req.body);
        //res.redirect("/thanks");
        db.submitPetition(req.body.signURL, req.session.id) //req.session.id = user.id
            .then(submitSignature =>{
                req.session.sigened = submitSignature.rows[0].id;
                res.redirect("/thanks");
            })
            .catch(err=>{
                console.log("error submitPetition: ", err);
            }); 
        //console.log('signature: ', req.body);   
    }
});
    

// GET THANKS //
app.get("/thanks", (req, res) => {
    db.showSignature(req.session.id).then(result =>{
        console.log('err results: ', result.rows[0]);
        console.log('err results 2: ', result.rows[0].signurl);
        res.render("thanks", {
            layout: "main",
            sig: result.rows[0].signurl

        });
    });
});

// GET SIGNERS //
app.get("/signers", (req, res) => {
    db.allSigners().then(results =>{
        res.render("signers", {
            layout: "main", 
            names: results.rows
        });
        console.log("return all signers;", results);
        //return results.rows;
    }).catch (err => {
        console.log('err in return all signers: ', err);
    });  
});


app.listen(8080, () => console.log('Petition listening!'));