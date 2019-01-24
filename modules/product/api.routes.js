var express = require("express");
var router = express.Router();
var ctrl = require("./product.controller");
var multer = require('multer');
var path = require('path');
var url = require("url");

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/products')
    },
    filename: (req, file, cb) => {
    //   console.log(file);
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

var upload = multer({storage: storage}).array('image',22);

module.exports = router;

router.get("/", ensureAuthenticate, (req, res) => {
    ctrl.listProduct(req,response=> {
        response.pagename = "product";
        res.render("product", {data:response, queryString :req.query,  pagination : {page : response.currentpage, pageCount :response.totalpages }});
    });
});



router.get("/add",  (req, res) => {
    var categoryAr = [];
    var brandAr = [];
    var data = [];
    ctrl.categorylist(req,response=> {
        // console.log("Category LIST ",response);
        data.pagename = "product";
        categoryAr  = response;
        ctrl.brandlist(req,response=> {
            // console.log("Brand LIST ",response);
            brandAr = response
            console.log("CATEGORY: ", categoryAr);
            console.log("BRAND: ", brandAr);
            res.render("product-add", {category : categoryAr, brand : brandAr, data:data});
        });
    });

});

router.get("/editproduct/:id", ensureAuthenticate, (req,res) =>{
    var id = req.params.id;
    var categoryAr = [];
    var brandAr = [];
    var data = [];
    // console.log(id);
    ctrl.categorylist(req,response=> {
        // console.log("Category LIST ",response);
        response.pagename = "product";
        categoryAr  = response;
        ctrl.brandlist(req,response=> {
            // console.log("Brand LIST ",response);
            brandAr = response
            // console.log("CATEGORY: ", categoryAr);
            // console.log("BRAND: ", brandAr);
            ctrl.editProduct(id, response=>{
                response.pagename = "product";
                res.render("editproduct", {category : categoryAr, brand : brandAr, data:response});
                // res.render("editproduct", {data : response});
            });
        });
    });
});

router.get("/delete/:id",ensureAuthenticate, (req, res) => {
    var id = req.params.id;
    console.log(id);
    ctrl.DelProduct(id, response=> {
        // res.json(response);
        // console.log(response);
        if(response.status==false)
        {
            req.flash("error_msg", "Sorry! Product doesn't Exist");
            res.redirect("/product");     
        }else{
            req.flash("success_msg", "Congratulations! Product Successfully Deleted");
            res.redirect("/product");
        }
    });
     
});


router.post("/updateproduct",ensureAuthenticate, function(req, res){
        
    upload(req, res, err =>{
        if(err) res({msg : "Image Could not be Uploaded."+err, status : false});
        console.log("REQ  ", req.file);
            if(req.file == undefined){
                req.body.image = '';
            }else{
                req.body.image = req.file.filename;
            }
            // req.body.image = req.file.filename;
            ctrl.updateProduct(req, response=> {
            // res.json(response);
            console.log(response);
            if(response.status==false)
            {
                req.flash("error_msg", "Sorry! Product SKU already exist, Please try with another SKU");
                res.redirect("/product");     
            }else{
                req.flash("success_msg", "Congratulations! Product Successfully Created");
                res.redirect("/product");
            }
        });
        // res.send("File is uploaded");
    });
});


router.post("/saveproduct",  (req, res) =>{
    upload(req, res, err =>{
        if(err) req.flash("error_msg", "Image Could not be Uploaded."+err); res.redirect("/product");
        console.log(res.req.files);
        req.body.image = res.req.files;
        ctrl.saveProduct(req, response=> {
            console.log(response);
            if(response.status==false)
            { 
                req.flash("error_msg", "Sorry! Product already exist, Please try with another SKU");
                res.redirect("/product");     
            }else{
                req.flash("success_msg", "Congratulations! Product Successfully Created");
                res.redirect("/product");
            }
        });
        // res.send("File is uploaded");
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