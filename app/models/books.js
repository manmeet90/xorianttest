const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BooksSchema = new Schema({
    bookName : {type:String, required: true},
    price : {type:Number, required: true},
    copies : {type: Number, default:1},
    copiesAvailable : Number,
    isActive : {type: Boolean, default:true}
});

module.exports = mongoose.model("books", BooksSchema);