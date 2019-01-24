var Batch = require("../../models").Collection.Batch;

module.exports = {
    saveBatch : saveBatch,
    listBatch : listBatch,
    DelBatch : DelBatch
}

function listBatch(res){
    Batch.find({}, (err, batch)=>{
        if(err) return res.status(200).send(err);
        if(batch)
        {
            return res({ batchdata : batch});
        }
    });
}

function DelBatch(id, res){
    console.log(id);
    Batch.findByIdAndRemove({_id : id}, (err, response)=>{
        if (err) return response.status(200).send(err);
        res({msg : "Batch Successfully Deleted.", status : true});
    }) 
}

function saveBatch(req, res){
    var batch = new Batch(req);
    batch.save().then(function(data){
        // console.log(data);
        res({msg : "Batch Successfully Registered.", status : true});
    })
}