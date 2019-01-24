var express = require("express");
var router = express.Router();
var ctrl = require("./brand.controller");
var multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/brand')
    },
    filename: (req, file, cb) => {
      console.log(file);
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

var upload = multer({storage: storage}).single('image');

module.exports = router;

router.get("/", ensureAuthenticate, (req, res) => {
    // res.render("category");
    ctrl.listBrand(req, response=> {
        response.pagename = "brand";
        res.render("brand", {data:response,  queryString :req.query,  pagination : {page : response.currentpage, pageCount :response.totalpages }});
    });
});


router.post("/savebrand", ensureAuthenticate, (req, res) =>{
    console.log("formData", req.body);
    upload(req, res, err =>{
        if(err) req.flash("error_msg", "Image Could not be Uploaded."+err); res.redirect("/brand");
        req.body.image = req.file.filename;
        ctrl.saveBrand(req, response=> {
            console.log(response);
            if(response.status==false)
            {
                req.flash("error_msg", "Sorry! Brand already exist, Please try with another Brand Name");
                res.redirect("/brand");     
            }else{
                req.flash("success_msg", "Congratulations! Brand Successfully Created");
                res.redirect("/brand");
            }
        });
        // res.send("File is uploaded");
    });
});

router.get("/editbrand/:id", ensureAuthenticate, (req,res) =>{
    var id = req.params.id;
    // console.log(id);
    ctrl.editBrand(id, response=>{
        response.pagename = "brand";
        res.render("editbrand", {data : response});
    });
});

router.post("/updatebrand",ensureAuthenticate, function(req, res){
        
        upload(req, res, err =>{
            if(err) res({msg : "Image Could not be Uploaded."+err, status : false});
            console.log("REQ  ", req.file);
                if(req.file == undefined){
                    req.body.image = '';
                }else{
                    req.body.image = req.file.filename;
                }
                // req.body.image = req.file.filename;
                ctrl.updateBrand(req, response=> {
                // res.json(response);
                console.log(response);
                if(response.status==false)
                {
                    req.flash("error_msg", "Sorry! Brand already exist, Please try with another Brand");
                    res.redirect("/brand");     
                }else{
                    req.flash("success_msg", "Congratulations! Brand Successfully Created");
                    res.redirect("/brand");
                }
            });
            // res.send("File is uploaded");
        });
});

router.get("/delete/:id", ensureAuthenticate, (req, res) =>{
    var id = req.params.id;
    ctrl.deleteBrand(id, response=>{
        req.flash("success_msg", "Congratulations! Brand Successfully Deleted");
        res.redirect("/brand");
    })
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