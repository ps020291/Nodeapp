var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var categorySchema = new Schema({
    name : String,
    image : String,
    status : String,
    is_featured : Boolean,
    url : String,
    meta_title : String,
    meta_keyword : String,
    meta_description : String,
    description : String,
    created_at : Date
}); 

var Category = mongoose.model("Category", categorySchema);
module.exports = Category;