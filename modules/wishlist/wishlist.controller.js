var Wishlist = require("../../models").Collection.Wishlist;

module.exports = {
    listData: listData,
    saveWishlist: saveWishlist,
    DelWishlist : DelWishlist
}

function listData(req, res) {
    var id = req.params.id;
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

    Wishlist.count(search, (err, totalcount) => {
        if (err) return res.status(200).send(err);
        console.log(totalcount);
        Wishlist.find().populate('product').populate('customer').exec(function (err, data) {
            if (err) return res.status(200).send(err);
            if (data) {
                console.log(data);
                var totalpages = Math.ceil(totalcount / limit);
                return res({ data: data, totalpages: totalpages, totalcount: totalcount, currentpage: currentpage });
            }
        });
    });
 }

// function listData(req, res) {
//     var id = req.params.id;
//     Wishlist.find().populate('product').exec(function (err, data) {
//         if (err) console.log(err);
//         if (data) {
//             console.log(data);
//             return res({data : data});
//         }
//     });
// }


function DelWishlist(id, res){
    Wishlist.findByIdAndRemove({_id : id}, (err, response)=>{
        if (err) return response.status(200).send(err);
        return res({msg : "Wishlist Successfully Deleted.", status : true});
    }) 
}
function saveWishlist(req, response) {
    req = req.body;
    var request = {};
    request.product =  req.product_id;
    request.customer = req.customer_id;
    request.added_at = new Date();
    var wishlist = new Wishlist(request);
    wishlist.save().then(function (data) {
        // console.log(data);
        response({ msg: "Wishlist Successfully Added.", status: true });
    })
} 