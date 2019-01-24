var User = require("../../models").Collection.User;
var bcrypt = require("bcryptjs");

module.exports = {
    
    saveUser : saveUser
}

function saveUser(req, response){
    
    // console.log("Body Message " + +"  " +req.name);
    req.status = "Active";
    req.role = "Admin";
    req.permission = [];
    req.added_at = new Date();
    // console.log(json.stringify(body));
    var user = new User(req);
    User.findOne({email : req.email}, (err, res)=>{
        if (err) return res.status(200).send(err);
        if(res==null)
        {
            // console.log("Old Password : " + req.password);
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.password, salt, function(err, hash) {
                    // Store hash in your password DB.
                    user.password = hash;
                    // console.log("New Password : " + user);
                    user.save().then(function(data){
                        // console.log(data);
                        response({msg : "User Successfully Registered.", status : true});
                    })
                });
            });
            // user.Collection.User.insert(body, (err, doc))
        }else{
            response({msg : "Email Already Exist.", status : false});
        }
    }) 
}