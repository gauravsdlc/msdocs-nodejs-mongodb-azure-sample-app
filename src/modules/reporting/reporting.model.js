
const validator = require('validator');
const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../models/plugins');
const counterIncrementor = require('../../utils/counterIncrementer');
const status = {
    unpaid: 0,
    paid: 1,
    pastdue: 2,
}

const ReportSchema = mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
        },
        calculatedPoints: {
            type: Number,
            default:0
        },
        dueDate: {
            type: Date,
            // required: true,
        },
        startDate: {
            type: Date,
            // required: true,
        },
        endDate: {
            type: Date,
            // required: true,
        },
        status: {
            type: Number,
            default: 0,
        },
        invoiceNumber: 
            { type: Number }
        ,
        invoiceGeneratedBy: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true
        },
        invoiceGeneratedFor: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true
        },
        seqId: { type: Number },
        pointsArray:{
            type:mongoose.SchemaTypes.Array,
            default:[]
        },
        isInitiated: { type: Boolean,default:false },
        active: { type: Boolean,default:true },
    },
    {
        timestamps: true,
    }
);
// add plugin that converts mongoose to json
ReportSchema.plugin(toJSON);
ReportSchema.plugin(paginate);

ReportSchema.pre('save', async function (next) {
    const doc = this;
    doc.seqId = await counterIncrementor('Report')
    // doc.invoiceNumber = await counterIncrementor('0B535005-')
    next();
});

/**
 * @typedef ReportSchema
 */
const Report = mongoose.model('Report', ReportSchema)

module.exports = Report;
