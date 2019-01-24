var express = require("express");
var router = express.Router();
module.exports = router;


router.get("/", ensureAuthenticate, (req, res) => {
    res.pagename = "home";
    res.render("dashboard", {message:res});
    // res.send("Dashboard Page");
});


function ensureAuthenticate(req, res, next){
    if(req.isAuthenticated()){
        // console.log("IS_AUTH");
        next();
    }else{
        req.flash("error_msg", "You are not logged in");
        res.redirect("/login");
    }
}