var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var productSchema = new Schema({
    sku : String,
    title : String,
    short_description : String,
    long_description : String,
    brand_id : mongoose.Schema.Types.ObjectId,
    url : String,
    is_featured : Boolean,
    price : Number,
    offer_price : Number,
    shipping : String,
    shipping_charge : Number,
    quantity : Number,
    notify_qty : Number,
    stock : String,
    discount : String,
    discount_status : Boolean,
    discount_type : String,
    meta_title : String,
    meta_keyword : String,
    meta_description : String,
    category_id : Array,
    image : [
        {
            name : String
        }
    ],
    related_product : Array,
    review_allow : Boolean,
    status : String,
    created_at : Date,
    updated_at : Date
}); 

var Product = mongoose.model("Product", productSchema);
module.exports = Product;