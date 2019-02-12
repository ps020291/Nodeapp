var express = require("express");
var router = express.Router();
var ctrl = require("./login.controller");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const say = require('say')
// say.setPlatform(say.platforms.WIN32);
module.exports = router;


router.get("/", ensureAuthenticate, (req, res) => {
    
    // say.getInstalledVoices((err, data)=>{
    //     if(err) console.log(err);
    //     console.log(data)
    // })
    // say.speak("What's up, dog?", 'Good News', 1.0, (err) => {
    //     if (err) {
    //       return console.error(err)
    //     }
       
    //     console.log('Text has been spoken.')
    //   });

    // res.send("here");
    var data = [];
    data.pagename = "login";
    res.render("login", {data : data});
});


function ensureAuthenticate(req, res, next){
    if(!req.isAuthenticated()){
        // res.redirect("/dashboard");
        next();
    }else{
        // req.flash("error_msg", "You are not logged in");
        res.redirect("/dashboard");
    }
}

passport.use(new LocalStrategy(
    function (username, password, done) {
        ctrl.getUserByEmail(username, password, response =>{
            // console.log("done "+ JSON.stringify(response));
            if(response.status){
                return done(null, response.user, {message : "Congratulations! You are Logging In"});
            }else{
                // req.flash("error_msg", done.msg);
                return done(null, false, {message : response.msg});
                // done.redirect("/");
            }
        });
    }
));

passport.serializeUser(function (user, done) {
    console.log("Serialize "+user);
    done(null, user);
});

passport.deserializeUser(function (id, done) {
    ctrl.getUserByID(id, function (err, user) {
        done(err, user);
    });
});

router.post("/authenticate",
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }),
    function (req, res) {

        res.redirect("/");
    }
);
