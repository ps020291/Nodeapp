var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bannerSchema = new Schema({
    title : String,
    image : String,
    description : String,
    status : String
}); 

var Banner = mongoose.model("Banner", bannerSchema);
module.exports = Banner;