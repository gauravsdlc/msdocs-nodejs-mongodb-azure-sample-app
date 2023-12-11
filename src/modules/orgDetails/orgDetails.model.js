
const validator = require('validator');
const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../models/plugins');
const counterIncrementor = require('../../utils/counterIncrementer');
const status = {
    pending: 0,
    active: 1,
    inactive: 2,
}

const OrgDetailsSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        wallet: {
            type: Object,
            default: {}
        },
        desc: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            required: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email');
                }
            },
        },
        organizationId: {//Todo: should be organizationId
            type: String,
            trim: true,
        },
        status: {
            type: Number,
            default: 1,
        },
        conversionRate: {
            type: Number,
            default: 1,
        },
        agreementDocuments :
            [
                {
                    name: '',
                    docUrl: '',
                    type: ''
                }
            ]
        ,
        otherDocuments:
            [
                {
                    name: '',
                    docUrl: '',
                    type: ''
                }
            ]
        ,
        commission: {
            type: Number,
            default: 0
        },
        primaryCurrency:{
            type:mongoose.SchemaTypes.ObjectId,
        },
        supportedCurrency: [
            { type: mongoose.SchemaTypes.ObjectId ,default:[]},
        ],
        metadata: {

        },
        seqId: { type: Number },
        active: { type: Boolean,default:true },
    },
    {
        timestamps: true,
    }
);
// add plugin that converts mongoose to json
OrgDetailsSchema.plugin(toJSON);
OrgDetailsSchema.plugin(paginate);

OrgDetailsSchema.pre('save', async function (next) {
    const doc = this;
    doc.seqId = await counterIncrementor('orgDetails')
    doc.organizationId =  doc.seqId;

    next();
});

OrgDetailsSchema.statics.isEmailTaken = async function (email, organizationId) {

    const org = await this.findOne({ email, organizationId: { $ne: organizationId }, active:true});
    return !!org;
  };

/**
 * @typedef OrgDetailsSchema
 */
const OrgDetails = mongoose.model('orgDetails', OrgDetailsSchema)

module.exports = OrgDetails;
