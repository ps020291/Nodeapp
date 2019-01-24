var express = require("express");
var router = express.Router();
var ctrl = require("./users.controller");
module.exports = router;


router.get("/", ensureAuthenticate, (req, res) => {
    ctrl.listUsers(req, response=> {
        response.pagename = "users";
        res.render("users", {data:response,  queryString :req.query,  pagination : {page : response.currentpage, pageCount :response.totalpages }});
    });
    // res.render("users", {message:"Welconme"});
    // res.send("Dashboard Page");
});


router.get("/delete/:id",ensureAuthenticate, (req, res) => {
    var id = req.params.id;
    console.log(id);
    ctrl.DelUser(id, response=> {
        // res.json(response);
        // console.log(response);
        if(response.status==false)
        {
            req.flash("error_msg", "Sorry! User doesn't Exist");
            res.redirect("/users");     
        }else{
            req.flash("success_msg", "Congratulations! User Successfully Deleted");
            res.redirect("/users");
        }
    });
     
});



router.get("/edituser/:_id",ensureAuthenticate, function(req, res){
    var id = req.params._id;
    ctrl.editUser(id, response=> {
        response.pagename = "users";
        res.render("edituser", {data:response});
    });
});


router.post("/saveuser",ensureAuthenticate, function(req, res){
    var name =  req.body.name;
    var email =  req.body.email;
    var password =  req.body.password;
    var mobile =  req.body.mobile;
    console.log("Request : ",req.body);
    
    req.checkBody("name", "Please Enter Name").notEmpty();
    req.checkBody("email", "Please Enter Email").notEmpty();
    req.checkBody("email", "Please Enter valid Email").isEmail();
    req.checkBody("password", "Please Enter Password").notEmpty();
    req.checkBody("mobile", "Please Enter Mobile").notEmpty();
    var errors = req.validationErrors();
    if(errors){
        console.log(errors);
        // req.flash("errors", errors);
        // res.redirect("/users");     
        res.render("users", {
            errors : errors
        });
        console.log("Validation Error ");
    }else{
        
        // console.log("No Validation Error");
        ctrl.saveUser(req.body, response=> {
            // res.json(response);
            // console.log(response);
            if(response.status==false)
            {
                req.flash("error_msg", "Sorry! Email already exist, Please try with another email");
                res.redirect("/users");     
            }else{
                req.flash("success_msg", "Congratulations! You are Successfully Registed");
                res.redirect("/users");
            }
        });
        // req.flash("success_msg", "You have successfully Registered.");
        // res.redirect("/login");
    }
});

router.post("/updateuser",ensureAuthenticate, function(req, res){
    var name =  req.body.name;
    var email =  req.body.email;
    var password =  req.body.password;
    var mobile =  req.body.mobile;
    console.log("Request : ",req.body);
    
    req.checkBody("name", "Please Enter Name").notEmpty();
    req.checkBody("mobile", "Please Enter Mobile").notEmpty();
    var errors = req.validationErrors();
    if(errors){
        console.log(errors);
        // req.flash("errors", errors);
        // res.redirect("/users");     
        res.render("users", {
            // errors : errors
        });
        console.log("Validation Error ");
    }else{
        
        // console.log("No Validation Error");
        ctrl.updateUser(req.body, response=> {
            // res.json(response);
            // console.log(response);
            if(response.status==false)
            {
                req.flash("error_msg", "Sorry! User could not be Updated");
                res.redirect("/users");     
            }else{
                req.flash("success_msg", "Congratulations! You are Successfully Updated");
                res.redirect("/users");
            }
        });
        // req.flash("success_msg", "You have successfully Registered.");
        // res.redirect("/login");
    }
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