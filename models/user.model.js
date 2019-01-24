var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcryptjs");
var userSchema = new Schema({
    name : String,
    email : String,
    password : String,
    mobile : String,
    role : String,
    status : String,
    permission : [],
    added_at : Date,
}); 

var User = mongoose.model("User", userSchema);
module.exports = User;

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        console.log(candidatePassword+"   "+hash);
        if(err) throw err;
        callback(null, isMatch);
    })
}