module.exports = {
    sendErrorResponse : (res, errMessage= "Something went wrong", statusCode=500) =>{
        res.status(statusCode);
        res.json({
            message : errMessage
        });
    },

    sendSuccessResponse : (res, data, statusCode=200) =>{
        res.status(statusCode);
        res.json({
            data : data
        });
    },
    
    cleanObject : (obj, fieldsToRemove) => {
        let result =  obj.toJSON();
        if(result["_id"]){
            result.id = result["_id"];
            delete result["_id"];
        }
        if("__v" in result){
            delete result["__v"];
        }

        if(fieldsToRemove && fieldsToRemove.length>0){
            fieldsToRemove.forEach(field => {
                if(result[field]){
                    delete result[field];
                }
            });
        }
        return result;
    }
};