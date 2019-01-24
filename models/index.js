var User = require('./user.model');
var Customer = require('./customers.model');
var Batch = require('./batch.model');
var Student = require('./student.model');
var Course = require('./course.model');
var Chapter = require('./chapter.model');
var Category = require('./category.model');
var Brand = require('./brand.model');
var Banner = require('./banner.model');
var Promotion = require('./promotion.model');
var Product = require('./product.model');
var Wishlist = require('./wishlist.model');
var mongoose = require("mongoose");


module.exports ={
    mongoDBConnect:function(){
        mongoose.connect("mongodb://localhost:27017/nodeapp",(err)=>{
            if(err) console.warn(err);
            else console.log('Mongo connection success');
        });
    },
    Collection : {
        User : User,
        Batch : Batch,
        Student : Student,
        Course : Course,
        Chapter : Chapter,
        Category : Category,
        Customer : Customer,
        Brand : Brand,
        Banner : Banner,
        Promotion : Promotion,
        Product : Product,
        Wishlist : Wishlist
    } 

}
