var Brand = require("../../models").Collection.Brand;

module.exports = {
    listBrand : listBrand,
    saveBrand : saveBrand,
    editBrand : editBrand,
    updateBrand : updateBrand,
    deleteBrand : deleteBrand
}

function listBrand(req, res) {
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
        search.name = new RegExp('^' + req.query.key, 'i');
        
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

    Brand.count(search, (err, totalcount) => {
        if (err) return res.status(200).send(err);
        Brand.find(search, {}, query, (err, brand) => {
            if (err) return res.status(200).send(err);
            if (brand) {
                var totalpages = Math.ceil(totalcount / limit);
                return res({ brand: brand, totalpages: totalpages, totalcount: totalcount, currentpage: currentpage });
            }
        });
    });
 }
// function listBrand(req, res){
//     Brand.find({}, (err, brand)=>{
//         if(err) return res.status(200).send(err);
//         if(brand)
//         {
//             return res({ brand : brand});
//         }
//     });
// }


function saveBrand(req, response){
    var req = req.body;
    var file = req;
    req.created_at = new Date();
    // console.log(json.stringify(body));
    var brand = new Brand(req);
    Brand.findOne({name : req.name}, (err, res)=>{
        if (err) return response.status(200).send(err);
        if(res==null)
        {
            brand.save().then(function(data){
                response({msg : "Brand Successfully Created.", status : true});
            })
        }else{
            response({msg : "Brand Alreadty Exist, Please try again with another Brand Name", status : false});
        }
    }) 
}

function editBrand(id, res){
    Brand.findById({_id : id}, (err, brand)=>{
        if(err) throw err;
        if(brand!=null){
            res({data : brand, status: true});
        }else{
            res({data : '', status: false});
        }
    })
}

function updateBrand(req, response){
    var id = req.body._id;
    if(req.body.image==""){
        var Updaterequest = { $set : {name : req.body.name, status : req.body.status}};
    }else{
        var Updaterequest = { $set : {name : req.body.name, status : req.body.status, image : req.body.image}};
    }
    Brand.updateOne( {_id:id}, Updaterequest, (err, res) =>{
        if(err) return response.status(200).send(err);
        response({msg : "Brand Successfully Updated.", status : true});
    });

}

function deleteBrand(id, res){
    Brand.findByIdAndRemove({_id : id}, (err, response)=>{
        if (err) return response.status(200).send(err);
        res({msg : "Brand Successfully Deleted.", status : true});
    });
}