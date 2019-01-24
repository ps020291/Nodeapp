var Product = require("../../models/").Collection.Product;
var Brand = require("../../models/").Collection.Brand;
var Category = require("../../models/").Collection.Category;

module.exports = {
    listProduct: listProduct,
    saveProduct: saveProduct,
    DelProduct: DelProduct,
    editProduct: editProduct,
    updateProduct: updateProduct,
    categorylist: categorylist,
    brandlist: brandlist

}


function categorylist(req, res) {
    var data = {};
    Category.find({}, (err, category) => {
        if (err) res.status(200).send(err);
        if (category) {
            return res({ data: category });
        }
    });

}

function brandlist(req, res) {
    var data = {};
    Brand.find({}, (err, brand) => {
        if (err) res.status(200).send(err);
        if (brand) {
            return res({ data: brand });
        }
    });


}

function listProduct(req, res) {
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
        title = new RegExp('^' + req.query.key, 'i');
        sku = new RegExp('^' + req.query.key, 'i');
        search = {
            $or: [{title}, {sku}]
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

    Product.count(search, (err, totalcount) => {
        if (err) return res.status(200).send(err);
        Product.find(search, {}, query, (err, product) => {
            if (err) return res.status(200).send(err);
            if (product) {
                var totalpages = Math.ceil(totalcount / limit);
                return res({ products: product, totalpages: totalpages, totalcount: totalcount, currentpage: currentpage });
            }
        });
    });
}


function saveProduct(req, response) {
    var name = {};
    var img = [];
    var req = req.body;
    var file = req;
    var i=0;
    for (const iterator of req.image) {
        // img.name[i] = iterator.filename;
        // image.name = iterator.filename;
        img.push({name : iterator.filename}); 
    }
    console.log(img);
    req.image  = img;
    req.created_at = new Date();
    req.updated_at = new Date();
    // console.log(json.stringify(body));
    var product = new Product(req);
    Product.findOne({ sku: req.sku }, (err, res) => {
        if (err) return response.status(200).send(err);
        if (res == null) {
            product.save().then(function (data) {
                response({ msg: "Product Successfully Created.", status: true });
            })
        } else {
            response({ msg: "Product SKU Alreadty Exist, Please try again with another SKU", status: false });
        }
    })
}

function editProduct(id, res) {
    Product.findById({ _id: id }, (err, product) => {
        if (err) throw err;
        if (product != null) {
            res({ data: product, status: true });
        } else {
            res({ data: '', status: false });
        }
    })
}

function updateProduct(req, response) {
    var id = req.body._id;
    if (req.body.image == "") {
        var Updaterequest = { $set: { name: req.body.name, url: req.body.url, meta_title: req.body.meta_title, meta_keyword: req.body.meta_keyword, meta_description: req.body.meta_description, is_featured: req.body.is_featured, status: req.body.status } };
    } else {
        var Updaterequest = { $set: { name: req.body.name, url: req.body.url, meta_title: req.body.meta_title, meta_keyword: req.body.meta_keyword, meta_description: req.body.meta_description, is_featured: req.body.is_featured, status: req.body.status, image: req.body.image } };
    }
    Product.updateOne({ _id: id }, Updaterequest, (err, res) => {
        if (err) return response.status(200).send(err);
        response({ msg: "Product Successfully Updated.", status: true });
    });

}

function DelProduct(id, res) {
    Product.findByIdAndRemove({ _id: id }, (err, response) => {
        if (err) return response.status(200).send(err);
        res({ msg: "Product Successfully Deleted.", status: true });
    });
}