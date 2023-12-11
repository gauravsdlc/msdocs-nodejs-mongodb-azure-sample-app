const mongoose = require("mongoose");
const APIKEY = require("../modules/apiKeys/apiKey.model");
const orgDetails = require("../modules/orgDetails/orgDetails.model");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const authApiKey = () => async (req, res, next) => {
    const key = req.headers['x-api-key']
    let apiResult = []

    
    try {
        if (key) {
            const filterQuery = { active: true, apiKey: key };
            apiResult = await APIKEY.find(filterQuery)
        }
        if (!apiResult.length) {
            res.status(404).json({ message: 'unauthorized access' })
            //to prevent again sending of response 
            return
        }else{
            const orgId= apiResult[0].orgId;
            let orgData= await orgDetails.find({active:true,_id:mongoose.Types.ObjectId(orgId)})
            orgData=orgData[0]
            req.user = {orgData,orgId}
        }
    } catch (error) {
        next(error)
    }



    next()


};

module.exports = authApiKey;