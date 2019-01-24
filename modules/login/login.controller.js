var User = require("../../models").Collection.User;
var passport = require("passport");
var localStrategy = require("passport-local").Strategy;

module.exports = {
    
    // authenticate : authenticate,
    getUserByEmail : getUserByEmail,
    getUserByID   : getUserByID

}

function getUserByEmail(email, password, done)
{
    // console.log("here"+password+"  ");
    User.findOne({email : email}, (err, user)=>{
        if(err) return res.status(200).send(err);
        if(!user){
            return done({msg : "Sorry! User doesn't Exist", status : false});
            // return done(null, false, {message : "Sorry! User doesn't Exist"});
            
        }
        
        User.comparePassword(password, user.password, function(err, isMatch){
            if(err) throw err;
            // console.log(isMatch);
            if(isMatch){
                if(user.status=="Active")
                {
                    userdata = {
                        "_id" : user._id,
                        "name" : user.name,
                        "email" : user.email,
                        "role" : user.role,
                    }
                    console.log("match");
                    done({msg : "Congratulation! Logging In", status : true, user:userdata});
                    // return done(null, user);
                }else{
                    done({msg : "Sorry! Account is Deactivated", status : false});
                }
            }else{
                console.log("not match");
                done({msg : "Sorry! Invalid Email or Password", status : false});
                // return done(null, false, {message : "Invalid Password"});
            }
        });
    });
}

function getUserByID(id, callback){
    User.findById(id, callback);
}