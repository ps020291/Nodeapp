var mongoose = require("mongoose");
var config = {
				useNewUrlParser: true 
			}


module.exports = {
	mongooseConnect : function(){
		mongoose.connect("mongodb://localhost:27017/nodeapp",config, (err)=>{
			if(err) console.log("Error "+err);
			else console.log("Connected to MongoDB");
		});
	},
	mongooseConnectLive : function(){
		mongoose.connect("mongodb+srv://ps020291:ps020291@cluster0-clgv8.mongodb.net/test?retryWrites=true",config, (err)=>{
			if(err) console.log("Error "+err);
			else console.log("Connected to MongoDB");
		});
	}

}