var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var courseSchema = new Schema({
    name : String,
    duration : String,
    type : String,
    tags : [],
    batchEnrolled : []
});

module.exports = mongoose.model("Course", courseSchema);