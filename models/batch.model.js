var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var batchSchema = new Schema({
    name : String,
    status : String,
    startDate : Date,
    description : String
}); 

var Batch = mongoose.model("Batch", batchSchema);
module.exports = Batch;