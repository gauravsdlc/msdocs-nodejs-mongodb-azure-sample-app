const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const apiKeySchema = mongoose.Schema({
    name: {
      type: String,
      trim: true,
      required:true
    },
    endpointUrl: {
      type: String,
      // required: true,
      default:''
    },
    apiKey: {
      type: String,
      required: true,
    },
    expires: {
        type: Date,
        // required: true,
        default:null
    },
    lastUsed:{
      type: Date,
      default: new Date()
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    orgId: {
      type: Object,
      required:true
    },
    organizationId: {
      type: String,
      required:true
    },
    whitelist: [

    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
apiKeySchema.plugin(toJSON);
apiKeySchema.plugin(paginate);

apiKeySchema.pre('save', async function (next) {
  next();
});

/**
 * @typedef APIKEY
 */
const APIKEY = mongoose.model('apiKey', apiKeySchema);

module.exports = APIKEY;
