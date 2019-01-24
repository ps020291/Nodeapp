var express = require("express");
var ctrl = require("./register.controller");
var router = express.Router();

module.exports = router;


router.get("/", ensureAuthenticate, (req, res)=>{
    // res.send("here1");
    res.render("register");
});

function ensureAuthenticate(req, res, next){
    if(!req.isAuthenticated()){
        // console.log("IS_AUTH");
        next();
    }else{
        req.flash("error_msg", "You are not logged in");
        res.redirect("/dashboard");
    }
}

router.post("/signup", function(req, res){
    var name =  req.body.name;
    var email =  req.body.email;
    var password =  req.body.password;
    var mobile =  req.body.mobile;
    // console.log(req.body);
    req.checkBody("name", "Please Enter Name").notEmpty();
    req.checkBody("email", "Please Enter Email").notEmpty();
    req.checkBody("email", "Please Enter valid Email").isEmail();
    req.checkBody("password", "Please Enter Password").notEmpty();
    req.checkBody("mobile", "Please Enter Mobile").notEmpty();
    var errors = req.validationErrors();
    if(errors){
        res.render("register", {
            errors : errors
        });
        // console.log("Validation Error ");
    }else{
        
        // console.log("No Validation Error");
        ctrl.saveUser(req.body, response=> {
            // res.json(response);
            // console.log(response);
            if(response.status==false)
            {
                req.flash("error_msg", "Sorry! Email already exist, Please try with another email");
                res.redirect("/register");     
            }else{
                req.flash("success_msg", "Congratulations! You are Successfully Registed");
                res.redirect("/login");
            }
        });
        // req.flash("success_msg", "You have successfully Registered.");
        // res.redirect("/login");
    }
});
