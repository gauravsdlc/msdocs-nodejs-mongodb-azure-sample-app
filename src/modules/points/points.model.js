const mongoose = require('mongoose');
const PointsSchema = mongoose.Schema(
  {
    
    refId: {
      type: mongoose.SchemaTypes.String,
      default: null,
    },
    orgId: {
      type: mongoose.SchemaTypes.ObjectId,
      default: null,
    },
    customerId: {
      type: mongoose.SchemaTypes.String,
      default: '',
    },
    organizationId: {// created by organizationId
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    transferTo: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    currencyId: {
      type: mongoose.SchemaTypes.ObjectId,
    },
    status: {
      type: mongoose.SchemaTypes.Number,
      default: 0, // 0 Unsettled, 1 Settled, 2 Failed
    },
    active: {
      type: mongoose.SchemaTypes.Boolean,
      default: true,
    },
    tryCount: {
      type: mongoose.SchemaTypes.Number,
      required: true,
      default: 0
    },
    commissionType: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    txHash: {
      type: mongoose.SchemaTypes.String,
      default: "",
    },
    amount: {
      type: mongoose.SchemaTypes.Number,
      required: true,
    },
    commission: {
      type: mongoose.SchemaTypes.Number,
      required: true,
    },
    invoiceGenerated: {
      type: mongoose.SchemaTypes.Boolean,
      default: false,
    },
    currencyId: {
      type: mongoose.SchemaTypes.ObjectId, // Primary Currency Id
    },
    toCurrencyId: {
      type: mongoose.SchemaTypes.String,
      default: null,
    },
    toCurrencyRate: {
      type: mongoose.SchemaTypes.Number,
      default: 0,
    },
    currencyRate: {
      type: mongoose.SchemaTypes.Number,
      default: 0,
    },
    totalFilsToken: {
      type: mongoose.SchemaTypes.Number,
      default: 0
    },
    sentFilsToken: {
      type: mongoose.SchemaTypes.Number,
      default: 0
    }

  },
  {
    timestamps: true,
  }
);

const Counters = mongoose.model('points', PointsSchema);
module.exports = Counters;

