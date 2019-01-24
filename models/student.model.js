var mongoose = require("mongoose");
var Schema  = mongoose.Schema;
var studentSchema = new Schema({
    firstname: String,
    middlename: String,
    lastname: String,
    mobile: String,
    image: String,
    email: String,
    password: String,
    active: Boolean,
    enrollmentDate: Date,
    enrolledBatch: [{
        batchId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Batch'
        },
    enrollDate: Date,
    active: Boolean
    }]
});

module.exports = mongoose.model("Student", studentSchema);