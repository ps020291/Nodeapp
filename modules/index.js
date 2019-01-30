var express = require("express");
var cors = require('cors');
var loginRoutes = require("./login/api.routes");
var registerRoutes = require("./register/api.routes");
var dashboardRoutes = require("./dashboard/api.routes");
var usersRoutes = require("./users/api.routes");
var batchRoutes = require("./batch/api.routes");
var customerRoutes = require("./customers/api.routes");
var categoryRoutes = require("./category/api.routes");
var brandRoutes = require("./brand/api.routes");
var bannerRoutes = require("./banner/api.routes");
var promotionRoutes = require("./promotions/api.routes");
var productRoutes = require("./product/api.routes");
var wishlistRoutes = require("./wishlist/api.routes");
var logoutRoutes = require("./logout/api.routes");




module.exports = {
    mountApiRoutes : mountApiRoutes,
    corsRequest: corsRequest 
}

function corsRequest() {
    expressApp.use(cors({origin:["http://localhost:4200"],credentials: true})); 
    // cross origin
}

function mountApiRoutes(expressApp){
    var app = express.Router();
    app.use("/", loginRoutes);
    app.use("/login", loginRoutes);
    app.use("/register", registerRoutes);
    app.use("/dashboard", dashboardRoutes);
    app.use("/users", usersRoutes);
    app.use("/batch", batchRoutes);
    app.use("/customers", customerRoutes);
    app.use("/brand", brandRoutes);
    app.use("/banner", bannerRoutes);
    app.use("/category", categoryRoutes);
    app.use("/wishlist", wishlistRoutes);
    app.use("/promotion", promotionRoutes);
    app.use("/product", productRoutes);
    app.use("/logout", logoutRoutes);
    
    app.use("/api", customerRoutes);

    expressApp.use("/", app);
}
function ensureAuthenticate(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash("error_msg", "You are not logged in");
        res.redirect("/login");
    }
}