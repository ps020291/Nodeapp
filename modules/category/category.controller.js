var Category = require("../../models").Collection.Category;

module.exports = {
    listCategory : listCategory,
    saveCategory : saveCategory,
    editCategory : editCategory,
    updateCategory : updateCategory,
    deleteCategory : deleteCategory
}

// function listCategory(req, res){
//     Category.find({}, (err, category)=>{
//         if(err) return res.status(200).send(err);
//         if(category)
//         {
//             return res({ category : category});
//         }
//     });
// }

function listCategory(req, res) {
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

    Category.count(search, (err, totalcount) => {
        if (err) return res.status(200).send(err);
        Category.find(search, {}, query, (err, category) => {
            if (err) return res.status(200).send(err);
            if (category) {
                var totalpages = Math.ceil(totalcount / limit);
                return res({ category: category, totalpages: totalpages, totalcount: totalcount, currentpage: currentpage });
            }
        });
    });
 }


function saveCategory(req, response){
    var req = req.body;
    var file = req;
    req.created_at = new Date();
    // console.log(json.stringify(body));
    var category = new Category(req);
    Category.findOne({name : req.name}, (err, res)=>{
        if (err) return response.status(200).send(err);
        if(res==null)
        {
            category.save().then(function(data){
                response({msg : "Category Successfully Created.", status : true});
            })
        }else{
            response({msg : "Category Alreadty Exist, Please try again with another Category Name", status : false});
        }
    }) 
}

function editCategory(id, res){
    Category.findById({_id : id}, (err, category)=>{
        if(err) throw err;
        if(category!=null){
            res({data : category, status: true});
        }else{
            res({data : '', status: false});
        }
    })
}

function updateCategory(req, response){
    var id = req.body._id;
    if(req.body.image==""){
        var Updaterequest = { $set : {name : req.body.name, url : req.body.url, meta_title : req.body.meta_title, meta_keyword : req.body.meta_keyword, meta_description : req.body.meta_description, is_featured : req.body.is_featured, status : req.body.status}};
    }else{
        var Updaterequest = { $set : {name : req.body.name, url : req.body.url, meta_title : req.body.meta_title, meta_keyword : req.body.meta_keyword, meta_description : req.body.meta_description, is_featured : req.body.is_featured, status : req.body.status, image : req.body.image}};
    }
    Category.updateOne( {_id:id}, Updaterequest, (err, res) =>{
        if(err) return response.status(200).send(err);
        response({msg : "Category Successfully Updated.", status : true});
    });

}

function deleteCategory(id, res){
    Category.findByIdAndRemove({_id : id}, (err, response)=>{
        if (err) return response.status(200).send(err);
        res({msg : "Category Successfully Deleted.", status : true});
    });
}