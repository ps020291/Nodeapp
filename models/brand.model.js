var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var brandSchema = new Schema({
    name : String,
    image : String,
    status : String
}); 

var Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;