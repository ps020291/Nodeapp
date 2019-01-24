var express = require("express");
var router = express.Router();
var ctrl = require("./promotion.controller");
var multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/promotion')
    },
    filename: (req, file, cb) => {
      console.log(file);
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

var upload = multer({storage: storage}).single('image');

module.exports = router;

router.get("/", ensureAuthenticate, (req, res)=>{
    ctrl.getList(req, response=>{
        response.pagename = "promotion";
        res.render("promotion", {data: response,  queryString :req.query,  pagination : {page : response.currentpage, pageCount :response.totalpages }});
        
    })
})


router.post("/savepromotion", ensureAuthenticate, (req, res) =>{
    console.log("formData", req.body);
    upload(req, res, err =>{
        if(err) req.flash("error_msg", "Image Could not be Uploaded."+err);
        req.body.image = req.file.filename;
        ctrl.savePromotion(req, response=> {
            console.log(response);
                req.flash("success_msg", "Congratulations! promotion Successfully Created");
                res.redirect("/promotion");
        });
        // res.send("File is uploaded");
    });
});

router.post("/updatepromotion", ensureAuthenticate, (req, res) => {
    upload(req, res, err =>{
        if(err) res({msg : "Image Could not be Uploaded."+err, status : false});
        // console.log("REQ  ", req.file.filename);
        if(req.file == undefined){
            req.body.image = '';
        }else{
            req.body.image = req.file.filename;
        }
        ctrl.updatePromotion(req, response=> {
            // res.json(response);
            console.log(response);
            req.flash("success_msg", "Congratulations! Promotion Succcessfully UPdated");
            res.redirect("/promotion");
            
        });
        // res.send("File is uploaded");
    });
})



router.get("/editpromotion/:id",ensureAuthenticate, (req, res) => {
    var id = req.params.id;
    console.log(id);
    ctrl.editPromotion(id, response=> {
        response.pagename = "promotion";
        res.render("editpromotion", {data : response});
    });
     
});


router.get("/delete/:id",ensureAuthenticate, (req, res) => {
    var id = req.params.id;
    console.log(id);
    ctrl.DelPromotion(id, response=> {
        // res.json(response);
        // console.log(response);
        if(response.status==false)
        {
            req.flash("error_msg", "Sorry! Promotion doesn't Exist");
            res.redirect("/promotion");     
        }else{
            req.flash("success_msg", "Congratulations! Promotion Successfully Deleted");
            res.redirect("/promotion");
        }
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