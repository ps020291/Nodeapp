var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcryptjs");
var customerSchema = new Schema({
    firstName : String,
    lastName : String,
    email : String,
    password : String,
    mobile  : String,
    image: String,
    status : String,
    address : [{
        address1 : String,
        address2 : String,
        city: String
    }],
    added_at : Date

});

var Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;


module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        console.log(candidatePassword+"   "+hash);
        if(err) throw err;
        callback(null, isMatch);
    })
}