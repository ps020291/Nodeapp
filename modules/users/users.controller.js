var User = require("../../models").Collection.User;
var bcrypt = require("bcryptjs");

module.exports = {
    listUsers : listUsers,
    saveUser : saveUser,
    DelUser : DelUser,
    editUser : editUser,
    updateUser : updateUser

}


function listUsers(req, res) {
    let page = 0
    if(req.query.page!=undefined || req.query.page!=NaN)
    {
        page = parseInt(req.query.page);
    }
    let limit = 10;
    let currentpage = 0;
    var search = {};
    if (req.query.limit == "") {
        limit = parseInt(req.query.limit);
    }
    if (page < 0 || page == undefined || page == NaN) {
        page = 1;
    }
    if (req.query.key != undefined) {
        // search.title = new RegExp('^' + req.query.key, 'i');
        name = new RegExp('^' + req.query.key, 'i');
        email = new RegExp('^' + req.query.key, 'i');
        mobile = new RegExp('^' + req.query.key, 'i');
        search = {
            $or: [{name}, {email}, {mobile}]
        };
    }
    
    if ((req.query.from != undefined && req.query.from != '') &&  (req.query.to != '' && req.query.to != undefined)) {
        from = new Date(req.query.from);
        to = new Date(req.query.to);
        search.created_at = {"$gte": new Date(from.getFullYear(), from.getMonth(), from.getDate()), "$lt": new Date(to.getFullYear(), to.getMonth(), to.getDate())};

    }

    if(req.query.status!= undefined && req.query.status!= ''){
        search.status = req.query.status;
    }
    // console.log(req.query);
    
    currentpage = page;
    var query = {};
    query.skip = limit * (page - 1);
    query.limit = limit;

    User.count(search, (err, totalcount) => {
        if (err) return res.status(200).send(err);
        User.find(search, {}, query, (err, user) => {
            if (err) return res.status(200).send(err);
            if (user) {
                var totalpages = Math.ceil(totalcount / limit);
                return res({ users: user, totalpages: totalpages, totalcount: totalcount, currentpage: currentpage });
            }
        });
    });
 }
// function listUsers(res){
//     User.find({}, (err, user)=>{
//         if(err) return res.status(200).send(err);
//         if(user)
//         {
//             return res({ users : user});
//         }
//     });
// }


function saveUser(req, response){
    
    // console.log("Body Message " + +"  " +req.name);
    // req.status = "Active";
    // req.role = "Admin";
    req.permission = [];
    req.added_at = new Date();
    // console.log(json.stringify(body));
    var user = new User(req);
    User.findOne({email : req.email}, (err, res)=>{
        if (err) return response.status(200).send(err);
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


function updateUser(req, response){
    var request = {};
    // console.log("Body Message ", req);
    request.name = req.name;
    request.mobile = req.mobile;
    request.status = req.status;
    request.role = req.role;
    request.permission = [];
    var myquery = { _id: req.id };
    if(req.password!="")
    {
        request.password = req.password;
    }else{
        var newquery = { $set : {name: req.name, mobile: req.mobile, status: req.status, role: req.role}};
    }
    // console.log(request);
    var user = new User(request);
    if(req.password!="")
    {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.password, salt, function(err, hash) {
                // Store hash in your password DB.
                request.password = hash;
                var newquery = { $set : {name: req.name, mobile: req.mobile, status: req.status, role: req.role, password : hash}};
                User.updateOne(myquery, newquery, function(err, res){
                    if(err) return response.status(200).send(err);
                    console.log("User Successfully Updated");
                    response({msg : "User Successfully Updated.", status : true});
                });
            });
        });
    }else{
        User.updateOne(myquery, newquery, function(err, res){
            if(err) return response.status(200).send(err);
            console.log("User Successfully Updated");
            response({msg : "User Successfully Updated.", status : true});
        });
    }
    
}


function editUser(id, res, callback){
    User.findById(id, (err, user)=>{
        // console.log("Error ",err);
        // console.log("user ",user);
        // if (err) return callback.status(200).send(err);
        if (err) throw err;;
        if(user!=null)
        {   
            res({data : user,  status:true});
        }else{
            res({data : '', status:false});  
        }
    });
}

function DelUser(id, res){
    console.log(id);
    User.findByIdAndRemove({_id : id}, (err, response)=>{
        if (err) return response.status(200).send(err);
        res({msg : "User Successfully Deleted.", status : true});
    }) 
}