var Customer = require("../../models").Collection.Customer;
var bcrypt = require("bcryptjs");
var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/images/')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({storage: storage});

 module.exports = {
     listCustomers : listCustomers,
     saveCustomer : saveCustomer,
     editCustomer : editCustomer,
     DelCustomer: DelCustomer,
     updateCustomer : updateCustomer,
     ApiLogin : ApiLogin,
     ValidateToken : ValidateToken
 }

 function listCustomers(req, res) {
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

    Customer.count(search, (err, totalcount) => {
        if (err) return res.status(200).send(err);
        Customer.find(search, {}, query, (err, user) => {
            if (err) return res.status(200).send(err);
            if (user) {
                var totalpages = Math.ceil(totalcount / limit);
                return res({ customers: user, totalpages: totalpages, totalcount: totalcount, currentpage: currentpage });
            }
        });
    });
 }
//  function listCustomers(req, res){
//     Customer.find({}, (err, user)=>{
//         if(err) return res.status(200).send(err);
//         if(user)
//         {
//             return res({ customers : user});
//         }
//     });
//  }

 function saveCustomer(req, response){
    var req = req.body;
    var file = req;
    req.added_at = new Date();
    var customer = new Customer(req);
    Customer.findOne({email : req.email}, (err, res)=>{
        if (err) return response.status(200).send(err);
        if(res==null)
        {
            // console.log("Old Password : " + req.password);
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.password, salt, function(err, hash) {
                    // Store hash in your password DB.
                    customer.password = hash;
                    // console.log("New Password : " + customer);
                    
                    customer.save().then(function(data){
                        // console.log(data);
                        response({msg : "Customer Successfully Registered.", status : true});
                    })
                });
            });
            // user.Collection.User.insert(body, (err, doc))
        }else{
            response({msg : "Email Already Exist.", status : false});
        }
    }) 
}




function updateCustomer(req, response){
    var req = req.body;
    var request = {};
    request.firstName = req.firstName;
    request.lastName = req.lastName;
    request.mobile = req.mobile;
    request.status = req.status;
    var myquery = { _id: req.id };
    console.log(req);
    if(req.password!="")
    {
        request.password = req.password;
    }else{
        console.log("REQ ", req);
        if(req.image!=""){
            var newquery = { $set : {firstName: req.firstName, lastName: req.lastName, mobile: req.mobile, status: req.status, image: req.image}};
        }else{
            var newquery = { $set : {firstName: req.firstName, lastName: req.lastName, mobile: req.mobile, status: req.status}};
        }
    }
    
    var customer = new Customer(request);
    if(req.password!="")
    {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.password, salt, function(err, hash) {
                // Store hash in your password DB.
                request.password = hash;
                var newquery = { $set : {firstName: req.firstName, lastName: req.lastName, mobile: req.mobile, status: req.status, password : hash}};
                Customer.updateOne(myquery, newquery, function(err, res){
                    if(err) return response.status(200).send(err);
                    response({msg : "Customer Successfully Updated.", status : true});
                });
            });
        });
    }else{
        Customer.updateOne(myquery, newquery, function(err, res){
            if(err) return response.status(200).send(err);
            console.log("Customer Successfully Updated");
            response({msg : "Customer Successfully Updated.", status : true});
        });
    }
}

function editCustomer(id, res, callback){
    Customer.findById(id, (err, user)=>{
        if (err) throw err;;
        if(user!=null)
        {   
            res({data : user,  status:true});
        }else{
            res({data : '', status:false});  
        }
    });
}


function DelCustomer(id, res){
    console.log(id);
    Customer.findByIdAndRemove({_id : id}, (err, response)=>{
        if (err) return response.status(200).send(err);
        res({msg : "Customer Successfully Deleted.", status : true});
    }) 
}

/***************************************************************/
// API Functions
/***************************************************************/

function ApiLogin(req, res) {
    var req = req;
    console.log(req);
    var customer = new Customer(req);
    Customer.findOne({email : req.email}, (err, cust)=>{
        if(err) return res.status(200).send(err);
        if(cust==null){
            return res.status(404).send({ auth: false, message: 'User not Found' });
        }
        if(cust){
            // return res("here");
            Customer.comparePassword(req.password, cust.password, function(err, isMatch){
                if(err) return res({msg:" Error in Password", status: false});
                if(isMatch){
                    if(cust.status=="Active")
                    {
                        userdata = {
                            "_id" : cust._id,
                            "name" : cust.firstName+" "+cust.lastName,
                            "email" : cust.email,
                            "image" : cust.image
                        }
                        console.log("match");
                        var token = Customer.SignToken(userdata);
                        return res({msg : "Congratulation! Logging In", status : true, data:userdata, token : token});
                        // return done(null, user);
                    }else{
                        return res({msg : "Sorry! Account is Deactivated", status : false});
                    }
                }else{
                    return res({msg : "Invalid Email or Password", status : false});    
                }
            }) 
        }
    });
}


function ValidateToken(id, res){
    Customer.findById(id,{password : 0}, (err, user)=>{
        if (err) throw err;;
        if(user!=null)
        {   
            res({data : user,  status:true});
        }else{
            res({data : '', status:false});  
        }
    });
}