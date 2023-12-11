const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../models/plugins');

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
    active: {
      type: Boolean,
      default: true,
    },
    isActive: { 
      type: mongoose.SchemaTypes.Boolean, 
      required: false
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true
    },
    orgId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true
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
const APIKEY = mongoose.model('apiKeys', apiKeySchema);

module.exports = APIKEY;