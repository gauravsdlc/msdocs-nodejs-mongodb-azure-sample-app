
const validator = require('validator');
const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../models/plugins');

const CurrencySchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        prefix: {
            type: String,
            trim: true,
            required: true,
        },
       
        logo: {
            type: String,
            // required: true
        },
        conversionRate:{
            type:Number,
            required:true
        },
        inActive: {     
            type:Boolean,
            default:false,
        },
        active: {       // for delete
            type:Boolean,
            default:true,
        },
    },
    {
        timestamps: true,
    }
);
// add plugin that converts mongoose to json
CurrencySchema.plugin(toJSON);
CurrencySchema.plugin(paginate);

/**
 * Check if name is taken
 * @param {string} name - The user's name
 * @param {ObjectId} [excludeCurrencyId] - The id of the currency to be excluded
 * @returns {Promise<boolean>}
 */
CurrencySchema.statics.isCurrencyNameTaken = async function (name, currencyId) {
    const currency = await this.findOne({ name, _id: { $ne: currencyId }, active: true });
    return !!currency;
};

/**
 * Check if prefix is taken
 * @param {string} prefix - The user's prefix
 * @param {ObjectId} [excludeCurrencyId] - The id of the currency to be excluded
 * @returns {Promise<boolean>}
 */
CurrencySchema.statics.isCurrencyPrefixTaken = async function (prefix, currencyId) {
    const currency = await this.findOne({ prefix, _id: { $ne: currencyId }, active: true });
    return !!currency;
};
CurrencySchema.pre('save', async function (next) {
    const doc = this;
    next();
});

/**
 * @typedef CurrencySchema
 */
const Currency = mongoose.model('currency', CurrencySchema)

module.exports = Currency;