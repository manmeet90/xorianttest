const express = require("express");
const authenticationRouter = express.Router();
const User = require("../models/users");
const utils = require("../utils");


authenticationRouter.post("/login", (req, res) => {
    req.body = req.body.data;
    if(!req.body.username){
        utils.sendErrorResponse(res, "username parameter missing");
    }else if(!req.body.password){
        utils.sendErrorResponse(res, "password parameter missing");
    }else{
        User.findOne({
            username : req.body.username,
            password : req.body.password,
            isActive: true
        }).exec()
        .then(user => {
            if(!user){
                utils.sendErrorResponse(res, "invalid login credentials");    
                return;
            }
            let data = utils.cleanObject(user, ["password"]);
            utils.sendSuccessResponse(res, data);
        }, err => {
            utils.sendErrorResponse(res);
        });
    }
});

authenticationRouter.post("/register", (req, res) => {
    req.body = req.body.data;
    if(!req.body.username){
        utils.sendErrorResponse(res, "username parameter missing");
    }else if(!req.body.password){
        utils.sendErrorResponse(res, "password parameter missing");
    }else{
        let user = new User({
            username : req.body.username,
            password : req.body.password
        }).save((err, user)=> {
            if(err){
                utils.sendErrorResponse(res);
            }else if(!user){
                utils.sendErrorResponse(res, "Error occured while creating user");    
            }else{
                let data = utils.cleanObject(user, ["password"]);
                utils.sendSuccessResponse(res, data);    
            }   
        });
    }
});

module.exports = authenticationRouter;