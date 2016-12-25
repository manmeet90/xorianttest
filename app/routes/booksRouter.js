const express = require("express");
const booksRouter = express.Router();
const Book = require("../models/books");
const utils = require("../utils");
const IssueHistory = require("../models/issueHistory");
const User = require("../models/users");

booksRouter.get("/", (req, res) => {
    Book.find({
        isActive: true
    }).exec()
    .then(books => {
        if(!books){
            utils.sendErrorResponse(res, "No books Found");    
            return;
        }
        let data = books.map(book => {
            return utils.cleanObject(book, []);
        });
        utils.sendSuccessResponse(res, data);
    }, err => {
        utils.sendErrorResponse(res);
    });
});

booksRouter.post("/", (req, res) => {
    req.body = req.body.data;
    if(!req.body.bookName){
        utils.sendErrorResponse(res, "bookName parameter missing");
    }else if(!req.body.price){
        utils.sendErrorResponse(res, "price parameter missing");
    }else{
        new Book({
            bookName : req.body.bookName,
            price : req.body.price,
            copies : req.body.copies || 1,
            copiesAvailable : req.body.copies || 1
        }).save((err, book) => {
            if(err){
                utils.sendErrorResponse(res);
            }else if(!book){
                utils.sendErrorResponse(res,  "error occure while creating book");
            }else{
                utils.sendSuccessResponse(res, utils.cleanObject(book, []));
            }
        });
    }
});

booksRouter.get("/:bookId", (req, res) => {
    Book.findOne({_id:req.params.bookId, isActive:true})
    .exec()
    .then(book => {
        if(!book){
            utils.sendErrorResponse(res, `No book with id ${req.params.bookId} found`);
        }else{
            utils.sendSuccessResponse(res, utils.cleanObject(book, []));
        }
    }, err => {
        utils.sendErrorResponse(res, `No book with id ${req.params.bookId} found`);
    });
});

booksRouter.put("/:bookId", (req, res) => {
    req.body = req.body.data;
    Book.findOne({_id:req.params.bookId, isActive:true})
    .exec()
    .then(book => {
        if(!book){
            utils.sendErrorResponse(res, `No book with id ${req.params.bookId} found`);
        }else{
            if(req.body.bookName){
                book.bookName = req.body.bookName;
            }
            if(req.body.price){
                book.price = req.body.price;
            }
            if(req.body.copies){
                book.copies = parseInt(req.body.copies, 10);
            }
            book.save( (err, _book) => {
                if(err || !_book){
                    utils.sendErrorResponse(res, `Error occured while updating book`);
                }else{
                    utils.sendSuccessResponse(res, utils.cleanObject(_book, []));
                }
            });
        }
    }, err => {
        utils.sendErrorResponse(res, `No book with id ${req.params.bookId} found`);
    });
});

booksRouter.delete("/:bookId", (req, res) => {
    Book.findOne({_id:req.params.bookId, isActive:true})
    .exec()
    .then(book => {
        if(!book){
            utils.sendErrorResponse(res, `No book with id ${req.params.bookId} found`);
        }else{
            book.isActive = false;
            book.save( (err) => {
                if(err){
                    utils.sendErrorResponse(res, `Error occured while updating book`);
                }else{
                    utils.sendSuccessResponse(res, {message : `Book id ${req.params.bookId} deleted successfully`});
                }
            });
        }
    }, err => {
        utils.sendErrorResponse(res, `No book with id ${req.params.bookId} found`);
    });
});

booksRouter.post("/issue/:flag", (req, res) => {
    req.body = req.body.data;
    if(!req.body.bookId){
        utils.sendErrorResponse(res, "bookId parameter is missing");
    }else if(!req.body.userId){
        utils.sendErrorResponse(res, "userId parameter is missing");
    }else{
        IssueHistory.findOne({
            bookId : req.body.bookId,
            memberId : req.body.userId,
            active : true
        }).exec()
        .then(book => {
            if(book && req.params.flag == 1){
                utils.sendErrorResponse(res, "You have already taken this book");
            }else if(!book && req.params.flag == 2){
                utils.sendErrorResponse(res, "This book is not issued to you");
            }else{
                _checkIfBookExist(req.body.bookId)
                .then(book => {
                    if(book){
                        if(book.copiesAvailable === 0 && req.params.flag == 1){
                            utils.sendErrorResponse(res, "No copies of book available currently");
                        }else{
                            _checkIfUserExist(req.body.userId)
                            .then(user => {
                                if(!user){
                                    utils.sendErrorResponse("user does not exist");
                                }else{
                                    _issueBookToUser(req.body.bookId, req.body.userId, req.params.flag, err => {
                                        if(err){
                                            utils.sendErrorResponse(res, `Error occured while checking ${req.params.flag ==1 ? "out": "in"} book`);
                                        }else{
                                            _updateBookCopiesAvailable(req.body.bookId, (err, book) => {
                                                if(err){
                                                    utils.sendErrorResponse(res);
                                                }else{
                                                    if(req.params.flag == 1){
                                                        book.copiesAvailable-=1;
                                                    }else{
                                                        book.copiesAvailable+=1;
                                                    }
                                                    book.save(err => {
                                                        if(err){
                                                            utils.sendErrorResponse(res);
                                                        }else{
                                                            utils.sendSuccessResponse(res, {message:`Book ${req.body.bookId} has been checked${req.params.flag ==1 ? "out": "in"} successfully`});
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            }, err => {
                                utils.sendErrorResponse(res);
                            });
                        }
                    }else{
                        utils.sendErrorResponse(res, `Book with id ${req.body.bookId} not found`);
                    }
                }, err => {
                    utils.sendErrorResponse(res);
                });
                      
            }
        }, err => {
            utils.sendErrorResponse(err);
        });
    }
});

booksRouter.get("/issues/:userId", (req, res) => {
    req.body = req.body.data;
    IssueHistory.find({
        memberId : req.params.userId,
        active : true
    })
    .populate("bookId", "id bookName price")
    .exec()
    .then(data => {
        let result = data.map(v => utils.cleanObject(v, []));
        utils.sendSuccessResponse(res, result);
    }, err => utils.sendErrorResponse(res));
});

function _checkIfBookExist(bookId){
    return Book.findOne({
        _id : bookId,
        isActive : true
    }).exec();
}

function _checkIfUserExist(userId){
    return User.findOne({
        _id : userId,
        isActive : true
    }).exec();
}

function _issueBookToUser(bookId, userId, flag, cb){
    if(flag == 1){
        return new IssueHistory({
            bookId : bookId,
            memberId : userId,
            checkInDate : (new Date()).toString()
        }).save(cb);
    }else{
        IssueHistory.findOne({
            bookId : bookId,
            memberId : userId
        }, (err, book)=>{
            if(err){
                cb(err);
            }else if(book){
                book.checkOutDate = (new Date()).toString();
                book.active = false;
                book.save(cb);
            }
        });
    }
}

function _updateBookCopiesAvailable(bookId, cb){
    Book.findById(bookId, cb);
}

module.exports = booksRouter;