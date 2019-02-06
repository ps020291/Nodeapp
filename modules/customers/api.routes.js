var express = require("express");
var router = express.Router();
var ctrl = require("./customers.controller");
var multer = require('multer');
var path = require('path');
var jwt = require('jsonwebtoken');
var SECRET = "Nodeapp";
var decodedToken = '';


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

var upload = multer({ storage: storage }).single('image');

module.exports = router;


router.get("/", ensureAuthenticate, (req, res) => {
    ctrl.listCustomers(req, response => {
        console.log(response);
        response.pagename = "customer";
        res.render("customers", { data: response, queryString: req.query, pagination: { page: response.currentpage, pageCount: response.totalpages } });
    });
    // res.render("customers", {message:"Welconme"});
    // res.send("Dashboard Page");
});

router.get("/editcustomer/:_id", ensureAuthenticate, function (req, res) {
    var id = req.params._id;
    ctrl.editCustomer(id, response => {
        response.pagename = "customer";
        res.render("editcustomer", { data: response });
    });
});


router.get("/delete/:id", ensureAuthenticate, (req, res) => {
    var id = req.params.id;
    console.log(id);
    ctrl.DelCustomer(id, response => {
        // res.json(response);
        // console.log(response);
        if (response.status == false) {
            req.flash("error_msg", "Sorry! Customer doesn't Exist");
            res.redirect("/customers");
        } else {
            req.flash("success_msg", "Congratulations! Customer Successfully Deleted");
            res.redirect("/customers");
        }
    });

});



router.post("/savecustomer", ensureAuthenticate, function (req, res) {
    let formData = req;
    console.log("formData", formData);
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;
    var mobile = req.body.mobile;
    var status = req.body.status;
    console.log("Request : ", req.body);

    // req.checkBody("firstName", "Please Enter First Name").notEmpty();
    // req.checkBody("lastName", "Please Enter Last Name").notEmpty();
    // req.checkBody("email", "Please Enter Email").notEmpty();
    // req.checkBody("email", "Please Enter valid Email").isEmail();
    // req.checkBody("password", "Please Enter Password").notEmpty();
    // req.checkBody("mobile", "Please Enter Mobile").notEmpty();
    // var errors = req.validationErrors();
    // if(errors){
    //     console.log(errors);
    //     // req.flash("errors", errors);
    //     // res.redirect("/users");     
    //     res.render("customers", {
    //         errors : errors
    //     });
    //     console.log("Validation Error ");
    // }else{
    upload(req, res, err => {
        if (err) res({ msg: "Image Could not be Uploaded." + err, status: false });
        // console.log("REQ  ", req.file.filename);
        req.body.image = req.file.filename;
        ctrl.saveCustomer(req, response => {
            // res.json(response);
            console.log(response);
            if (response.status == false) {
                req.flash("error_msg", "Sorry! Email already exist, Please try with another email");
                res.redirect("/customers");
            } else {
                req.flash("success_msg", "Congratulations! You are Successfully Registed");
                res.redirect("/customers");
            }
        });
        // res.send("File is uploaded");
    });
    // console.log("No Validation Error");
    // req.flash("success_msg", "You have successfully Registered.");
    // res.redirect("/login");
    // }
});

router.post("/updatecustomer", ensureAuthenticate, function (req, res) {
    let formData = req;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    // var password =  req.body.password;
    var mobile = req.body.mobile;
    var status = req.body.status;
    console.log("Request : ", formData);

    // req.checkBody("firstName", "Please Enter First Name").notEmpty();
    // req.checkBody("lastName", "Please Enter Last Name").notEmpty();
    // req.checkBody("email", "Please Enter Email").notEmpty();
    // req.checkBody("email", "Please Enter valid Email").isEmail();
    // req.checkBody("password", "Please Enter Password").notEmpty();
    // req.checkBody("mobile", "Please Enter Mobile").notEmpty();
    // var errors = req.validationErrors();
    // if(errors){
    //     console.log(errors);
    //     // req.flash("errors", errors);
    //     // res.redirect("/users");     
    //     res.render("customers", {
    //         errors : errors
    //     });
    //     console.log("Validation Error ");
    // }else{
    upload(req, res, err => {
        if (err) res({ msg: "Image Could not be Uploaded." + err, status: false });
        // console.log("REQ  ", req);
        if (req.file == undefined) {
            req.body.image = '';
        } else {
            req.body.image = req.file.filename;
        }
        // req.body.image = req.file.filename;
        ctrl.updateCustomer(req, response => {
            // res.json(response);
            console.log(response);
            if (response.status == false) {
                req.flash("error_msg", "Sorry! Email already exist, Please try with another email");
                res.redirect("/customers");
            } else {
                req.flash("success_msg", "Congratulations! You are Successfully Registed");
                res.redirect("/customers");
            }
        });
        // res.send("File is uploaded");
    });
    // console.log("No Validation Error");
    // req.flash("success_msg", "You have successfully Registered.");
    // res.redirect("/login");
    // }
});


/*********************************************************/
// API Function
/********************************************************/


router.post("/login", function (req, res) {
    var data = [];
    // res.send(req.body);
    ctrl.ApiLogin(req.body, response => {
        console.log(response);
        res.send(response);
        // response.pagename = "customer";
        // res.render("customers", {data:response,  queryString :req.query,  pagination : {page : response.currentpage, pageCount :response.totalpages }});
    });
})


router.get("/checkLogin", verifyToken, function (req, res) {
    var token = req.headers['x-access-token'];
    console.log(token);
    if (!token) {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    ctrl.ValidateToken(decodedToken.data._id, (user) => {
        if (!user) { 
            return res.status(404).send({ auth: false, message: 'No Customer Found' })
        } 
        else {
            return res.status(200).send(decodedToken);
        }

    })
})

router.get("/list",  (req, res) => {
    ctrl.listCustomers(req, response => {
        console.log(response);
        // response.pagename = "customer";
        res.status(200).send(response);
    });
    // res.render("customers", {message:"Welconme"});
    // res.send("Dashboard Page");
});

function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'];
    jwt.verify(token, SECRET, (err, decoded) => {
        console.log(decoded);
        if (err){ 
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }else{
            decodedToken = decoded;
            next();
        }
    })
}

function ensureAuthenticate(req, res, next) {
    if (req.isAuthenticated()) {
        // console.log("IS_AUTH");
        next();
    } else {
        req.flash("error_msg", "You are not logged in");
        res.redirect("/login");
    }
}