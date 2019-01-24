var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var chapterSchema = new Schema({
    chapterTitle : String,
    seqOrder : Number,
    active : Boolean,
    courseId :  Number,
    type : ["Free", "Restricted"],
    content : String,
    assignToBatch : []

});

module.exports = mongoose.model("Chapter", chapterSchema);