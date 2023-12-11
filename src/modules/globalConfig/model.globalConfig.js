const { object } = require('joi');
const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../models/plugins');
const counterIncrementor = require('../../utils/counterIncrementer');

const globalConfigSchema = mongoose.Schema(
    {
        tokenPrice: {
            type:Number,
        },  
        seqId: { 
            type: Number 
        },
        // orgCommission:{
        //     type:Number,
        // },
        platformCommission:{
            type:Number,
        },
        commissionType:{
            type:String,    //fixed or precentage
        },
        
    },
    {
        timestamps: true,
    }
);

globalConfigSchema.plugin(toJSON);
globalConfigSchema.plugin(paginate);


globalConfigSchema.pre('save',async function (next) {
    const doc = this;
    doc.seqId = await counterIncrementor('globalConfig')
    next();
});
// /**
//  * @typedef globalConfigSchema
//  */
const GlobalConfig = mongoose.model('globalConfig', globalConfigSchema)

// console.log("Model got")

module.exports = {GlobalConfig};