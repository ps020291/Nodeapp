var express = require("express");
var router = express.Router();
var ctrl = require("./category.controller");
var multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/category')
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
    ctrl.listCategory(req, response=> {
        response.pagename = "category";
        res.render("category", {data:response,  queryString :req.query,  pagination : {page : response.currentpage, pageCount :response.totalpages }});
    });
});


router.post("/savecategory", ensureAuthenticate, (req, res) =>{
    console.log("formData", req.body);
    upload(req, res, err =>{
        if(err) req.flash("error_msg", "Image Could not be Uploaded."+err); res.redirect("/category");
        req.body.image = req.file.filename;
        ctrl.saveCategory(req, response=> {
            console.log(response);
            if(response.status==false)
            {
                req.flash("error_msg", "Sorry! Category already exist, Please try with another Category Name");
                res.redirect("/category");     
            }else{
                req.flash("success_msg", "Congratulations! Category Successfully Created");
                res.redirect("/category");
            }
        });
        // res.send("File is uploaded");
    });
});

router.get("/editcategory/:id", ensureAuthenticate, (req,res) =>{
    var id = req.params.id;
    // console.log(id);
    ctrl.editCategory(id, response=>{
        response.pagename = "category";
        res.render("editcategory", {data : response});
    });
});

router.post("/updatecategory",ensureAuthenticate, function(req, res){
        
        upload(req, res, err =>{
            if(err) res({msg : "Image Could not be Uploaded."+err, status : false});
            console.log("REQ  ", req.file);
                if(req.file == undefined){
                    req.body.image = '';
                }else{
                    req.body.image = req.file.filename;
                }
                // req.body.image = req.file.filename;
                ctrl.updateCategory(req, response=> {
                // res.json(response);
                console.log(response);
                if(response.status==false)
                {
                    req.flash("error_msg", "Sorry! Category already exist, Please try with another Category");
                    res.redirect("/category");     
                }else{
                    req.flash("success_msg", "Congratulations! Category Successfully Created");
                    res.redirect("/category");
                }
            });
            // res.send("File is uploaded");
        });
});

router.get("/delete/:id", ensureAuthenticate, (req, res) =>{
    var id = req.params.id;
    ctrl.deleteCategory(id, response=>{
        req.flash("success_msg", "Congratulations! Category Successfully Deleted");
        res.redirect("/category");
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