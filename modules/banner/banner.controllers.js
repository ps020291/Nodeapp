var Banner = require("../../models").Collection.Banner;

module.exports = {
    getBannerList : getBannerList,
    saveBanner : saveBanner,
    getBannerByID : getBannerByID,
    updateBanner: updateBanner,
    delBanner : delBanner
}

function getBannerList(req, res) {
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
        search.title = new RegExp('^' + req.query.key, 'i');
        
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

    Banner.count(search, (err, totalcount) => {
        if (err) return res.status(200).send(err);
        Banner.find(search, {}, query, (err, banner) => {
            if (err) return res.status(200).send(err);
            if (banner) {
                var totalpages = Math.ceil(totalcount / limit);
                return res({ banner: banner, totalpages: totalpages, totalcount: totalcount, currentpage: currentpage });
            }
        });
    });
 }
// function getBannerList(req, res){
//     Banner.find({}, (err, banner)=>{
//         if(err) return res.status(200).send(err);
//         if(banner!=null){
//             return res({ banner : banner});
//         }
//     })
// }

function saveBanner(req, res){
    var banner = new Banner(req.body);
    banner.save().then(function(data){
        response({msg : "Banner Successfully Created.", status : true});
    })
}

function getBannerByID(id, res){
    Banner.findById({_id : id},(err, banner)=>{
        if(err) res({data : err, status:false});
        if(banner){
            res({data : banner, status:true});
        }else{
            res({data : '', status:false});
        }
    })
}


function updateBanner(req, res){
    var id = req.body._id;
    if(req.body.image==""){
        var Updaterequest = { $set : {title : req.body.title, description : req.body.description, status : req.body.status}};
    }else{
        var Updaterequest = { $set : {title : req.body.title, description : req.body.description, status : req.body.status, image : req.body.image}};
    }
    Banner.updateOne({_id : id}, Updaterequest, (err, response)=>{
        if(err) return res.status(200).send(err);
        res({msg : "Banner Successfully Updated.", status : true});
    })

}

function delBanner(id, res){
    Banner.findByIdAndRemove({_id : id}, (err, response)=>{
        if(err) return res.status(200).send(er);
        res({msg : "Banner Successfully Deleted.", status : true});
    })
}