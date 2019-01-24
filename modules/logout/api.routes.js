var express = require("express");
var router = express.Router();

module.exports = router;

router.get("/", (req, res)=>{
    req.logout();
    res.redirect('/');
})