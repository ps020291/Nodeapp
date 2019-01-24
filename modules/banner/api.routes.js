var express = require("express");
var router = express.Router();
var ctrl = require("./banner.controllers");
var multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/banner')
    },
    filename: (req, file, cb) => {
      console.log(file);
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

var upload = multer({storage: storage}).single('image');

module.exports = router;

router.get("/", ensureAuthenticate, (req, res) =>{
    ctrl.getBannerList(req, response => {
        response.pagename = "banner";
        res.render("banner", { data : response ,  queryString :req.query,  pagination : {page : response.currentpage, pageCount :response.totalpages }});

    })
});

router.post("/savebanner", ensureAuthenticate, (req, res)=>{
    upload(req, res, err =>{
        if(err) req.flash("error_msg", "Image Could not be Uploaded."+err); res.redirect("/banner");
        req.body.image = req.file.filename;
        ctrl.saveBanner(req, response=> {
            req.flash("success_msg", "Congratulations! Banner Successfully Created");
            res.redirect("/banner");
        });
        // res.send("File is uploaded");
    });
});


router.get("/editbanner/:id", ensureAuthenticate, (req, res)=>{
    var id = req.params.id;
    ctrl.getBannerByID(id, response=>{
        if(response.status){
            response.pagename = "banner";
            res.render("editbanner",{data:response});
        }else{
            req.flash("error_msg", "Sorry! Banner Could not found");
            res.redirect("/banner");
        }
    })
})

router.post("/updatebanner",ensureAuthenticate, function(req, res){
        
    upload(req, res, err =>{
        if(err) res({msg : "Image Could not be Uploaded."+err, status : false});
        console.log("REQ  ", req.file);
            if(req.file == undefined){
                req.body.image = '';
            }else{
                req.body.image = req.file.filename;
            }
            // req.body.image = req.file.filename;
            ctrl.updateBanner(req, response=> {
            // res.json(response);
            console.log(response);
            if(response.status==false)
            {
                req.flash("error_msg", "Sorry! Banner Could not be Updated");
                res.redirect("/banner");     
            }else{
                req.flash("success_msg", "Congratulations! Banner Successfully Updated");
                res.redirect("/banner");
            }
        });
        // res.send("File is uploaded");
    });
});

router.get("/delete/:id", ensureAuthenticate, (req, res)=>{
    var id = req.params.id;
    ctrl.delBanner(id, response=>{
        req.flash("success_msg", "Congratulations! Banner Successfully Deleted");
        res.redirect("/banner");
    })
})

function ensureAuthenticate(req, res, next){
    if(req.isAuthenticated()){
        // console.log("IS_AUTH");
        next();
    }else{
        req.flash("error_msg", "You are not logged in");
        res.redirect("/login");
    }
}