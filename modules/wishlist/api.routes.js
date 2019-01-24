var express = require("express");
var router = express.Router();
var ctrl = require("./wishlist.controller");

module.exports = router;

router.get("/:id", ensureAuthenticate, (req, res) => {
    var customer_id = req.params.id;
    ctrl.listData(req, response => {
        // console.log(response);
        response.pagename = "wishlist";
        res.render("wishlist", {data:response,  queryString :req.query,  pagination : {page : response.currentpage, pageCount :response.totalpages }});
    });
});

router.get("/delete/:customer_id/:id", ensureAuthenticate, (req, res) => {
    var id = req.params.id;
    var customer_id = req.params.customer_id;
    console.log(id);
    ctrl.DelWishlist(id, response=> {
        // res.json(response);
        // console.log(response);
        if(response.status==false)
        {
            req.flash("error_msg", "Sorry! Wishlist doesn't Exist");
            res.redirect("/wishlist/"+customer_id);     
        }else{
            req.flash("success_msg", "Congratulations! Wishlist Successfully Deleted");
            res.redirect("/wishlist/"+customer_id);
        }
    });
     
});



router.post("/savewishlist", ensureAuthenticate, (req, res) => {
    console.log("formData", req.body);
    ctrl.saveWishlist(req, response => {
        console.log(response);
        req.flash("success_msg", "Congratulations! Wishlist Successfully Created");
        res.redirect("/customers");
    });

});


function ensureAuthenticate(req, res, next) {
    if (req.isAuthenticated()) {
        // console.log("IS_AUTH");
        next();
    } else {
        req.flash("error_msg", "You are not logged in");
        res.redirect("/login");
    }
}