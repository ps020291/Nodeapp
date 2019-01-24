var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var wishlistSchema = new Schema({
    customer : { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    product : { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    added_at : Date

});

var Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;