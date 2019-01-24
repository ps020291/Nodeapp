var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var promotionSchema = new Schema({
    title : String,
    image : String,
    status : String,
    url : String,
    position : String,
    description : String,
    created_at : Date
}); 

var Promotion = mongoose.model("Promotion", promotionSchema);
module.exports = Promotion;