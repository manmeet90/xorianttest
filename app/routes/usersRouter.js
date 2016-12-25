const express = require("express");
const usersRouter = express.Router();
const User = require("../models/users");
const utils = require("../utils");

usersRouter.get("/", (req, res) => {
    User.find()
    .exec()
    .then(users => {
        let response = users.map(v => utils.cleanObject(v,['password']));
        utils.sendSuccessResponse(res, response);
    }, err => utils.sendErrorResponse(res));
});

module.exports = usersRouter;