const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    username : {type:String, required: true},
    password : {type:String, required: true},
    isActive : {type: Boolean, default:true}
});

module.exports = mongoose.model("users", UsersSchema);