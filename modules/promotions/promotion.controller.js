var Promotion = require("../../models").Collection.Promotion;

module.exports = {
    getList : getList,
    savePromotion : savePromotion,
    DelPromotion : DelPromotion,
    editPromotion : editPromotion,
    updatePromotion : updatePromotion
}


function editPromotion(id, res){
    Promotion.findById(id, (err, promotion)=>{
        if (err) throw err;;
        if(promotion!=null)
        {   
            res({data : promotion,  status:true});
        }else{
            res({data : '', status:false});  
        }
    });
}


function DelPromotion(id, res){
    console.log(id);
    Promotion.findByIdAndRemove({_id : id}, (err, response)=>{
        if (err) return response.status(200).send(err);
        res({msg : "Promotion Successfully Deleted.", status : true});
    }) 
}

function savePromotion(req, response){
    var req = req.body;
    var file = req;
    req.created_at = new Date();
    var promotion = new Promotion(req);
    promotion.save().then(function(data){
        // console.log(data);
        response({msg : "Promotion Successfully Added.", status : true});
    }) 
}


function updatePromotion(req, response){
    var req = req.body;
    var request = {};
    request.title = req.title;
    request.description = req.description;
    request.position = req.position;
    request.url = req.url;
    request.status = req.status;
    request.created_at = new Date();
    var myquery = { _id: req.id };
    if(req.image!=""){
        var newquery = { $set : {title: req.title, description: req.description, url: req.url, position: req.position, created_at: request.created_at, status: req.status, image: req.image}};
    }else{
        var newquery = { $set : {title: req.title, description: req.description, url: req.url, position: req.position, created_at: request.created_at, status: req.status}};
    }
   
    
    var promotion = new Promotion(request);
    
    Promotion.updateOne(myquery, newquery, function(err, res){
        if(err) return response.status(200).send(err);
        response({msg : "Promotion Successfully Updated.", status : true});
    });
   
}



function getList(req, res){
    Promotion.find({}, (err, response)=>{
        if(err) res({data:"Error : "+err, status: false});
        if(response){
            res({data : response, status: true});
        }
    })
}


function getList(req, res) {
    let page = parseInt(req.query.page);
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

    Promotion.count(search, (err, totalcount) => {
        if (err) return res.status(200).send(err);
        Promotion.find(search, {}, query, (err, promotion) => {
            if (err) return res.status(200).send(err);
            if (promotion) {
                var totalpages = Math.ceil(totalcount / limit);
                return res({ data: promotion, totalpages: totalpages, totalcount: totalcount, currentpage: currentpage });
            }
        });
    });
}
