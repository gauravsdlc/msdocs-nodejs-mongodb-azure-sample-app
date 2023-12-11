const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const counterIncrementor = require('../utils/counterIncrementer');


const passwordSchema = mongoose.Schema({
   
    orgId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    
    password: {
      type: Array,
      required: true,
    },
  },
  
);

// add plugin that converts mongoose to json
passwordSchema.plugin(toJSON);

passwordSchema.pre('save', async function (next) {
  const doc = this;
  doc.seqId = await counterIncrementor('Password')
  next();
});


/**
 * @typedef User
 */
const Password = mongoose.model('Password', passwordSchema);

module.exports = Password;
