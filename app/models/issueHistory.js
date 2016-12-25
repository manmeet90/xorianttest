const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IssueHistorySchema = new Schema({
    bookId : {type:Schema.Types.ObjectId, ref:"books", required: true},
    memberId : {type: Schema.Types.ObjectId, ref:"users", required : true},
    checkInDate : String,
    checkOutDate : String,
    active : {type: Boolean, default:true}
});

module.exports = mongoose.model("issueHistory", IssueHistorySchema);