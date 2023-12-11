
const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../models/plugins');
const counterIncrementor = require('../../utils/counterIncrementer');

const TokensSchema = mongoose.Schema(
    {
        
        orgId: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true
        },
        from: { // Sender'S wallet address
            type: String,
            required: true
        },
        walletAddress: {
            type: String,
            required: true
        },
        trnxHash: {
            type: String,
            required: true
        },
        amount:{
            type:Number,
            required:true
        },
        active: {       // for delete
            type:Boolean,
            default:true,
        },
        seqId: { type: Number },
    },
    {
        timestamps: true,
    }
);
// add plugin that converts mongoose to json
TokensSchema.plugin(toJSON);
TokensSchema.plugin(paginate);


TokensSchema.pre('save', async function (next) {
    const doc = this;
    doc.seqId = await counterIncrementor('TokenHistory')
    next();
});

/**
 * @typedef TokensSchema
 */
const TokenHistory = mongoose.model('TokenHistory', TokensSchema)

module.exports = TokenHistory;
