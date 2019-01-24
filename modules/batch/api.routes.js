var express = require("express");
var router = express.Router();
var ctrl  = require("./batch.controllers");
module.exports = router;

router.get("/", ensureAuthenticate, (req, res) => {
    ctrl.listBatch(response=> {
        response.pagename = "batch";
        res.render("batch", {data:response});
    });
    // res.render("users", {message:"Welconme"});
    // res.send("Dashboard Page");
});


router.get("/delete/:id",ensureAuthenticate, (req, res) => {
    var id = req.params.id;
    console.log(id);
    ctrl.DelBatch(id, response=> {
        // res.json(response);
        // console.log(response);
        if(response.status==false)
        {
            req.flash("error_msg", "Sorry! Batch doesn't Exist");
            res.redirect("/batch");     
        }else{
            req.flash("success_msg", "Congratulations! Batch Successfully Deleted");
            res.redirect("/batch");
        }
    });
     
});



router.post("/savebatch",ensureAuthenticate, function(req, res){
    var name =  req.body.name;
    var status =  req.body.status;
    var startDate =  req.body.startDate;
    var description =  req.body.description;
    console.log("Request : ",req.body);
    
    req.checkBody("name", "Please Enter Batch").notEmpty();
    req.checkBody("status", "Please Select Status").notEmpty();
    req.checkBody("startDate", "Please Enter Start Date").notEmpty();
    req.checkBody("description", "Please Enter Description").notEmpty();
    var errors = req.validationErrors();
    if(errors){
        console.log(errors);
        // req.flash("errors", errors);
        // res.redirect("/users");     
        res.render("batch", {
            errors : errors
        });
        console.log("Validation Error ");
    }else{
        
        // console.log("No Validation Error");
        ctrl.saveBatch(req.body, response=> {
            // res.json(response);
            // console.log(response);
            if(response.status==false)
            {
                req.flash("error_msg", "Sorry! Batch Could not be created");
                res.redirect("/batch");     
            }else{
                req.flash("success_msg", "Congratulations! Batch Successfully Added");
                res.redirect("/batch");
            }
        });
        // req.flash("success_msg", "You have successfully Registered.");
        // res.redirect("/login");
    }
});

router.get("/editbatch/:id", ensureAuthenticate, (req,res) =>{
    var id = req.params.id;
    // console.log(id);
    ctrl.editBatch(id, response=>{
        response.pagename = "batch";
        res.render("editbatch", {data : response});
    });
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