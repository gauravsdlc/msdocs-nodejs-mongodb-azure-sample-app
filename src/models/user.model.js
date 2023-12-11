const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const counterIncrementor = require('../utils/counterIncrementer');


const status = {
	pending: 0,
	active: 1,
	inactive: 2,
}

const userSchema = mongoose.Schema({
    name: {
      type: String,
      trim: true,
      required:true
    },
    organizationId: {
      type: String,
      trim: true,
    },
    orgId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      required: true,
    },
    profileUrl: {
      type: String,
      default:""
    },
    isEmailVerified:{
      type: Boolean,
      default: true,
    },
    status:{
      type: Number,
      default: 1, 
    },
    active: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    seqId: {
      type: Number
    },

  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, organizationId=null) {
  console.log("inside userSchemas",email, organizationId);
  const user = await this.findOne({ email, organizationId: { $ne: organizationId }, active:true });
  return !!user;
};

/**
 * Check if organizationId is taken
 * @param {string} organizationId - The user's organizationId
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */

userSchema.statics.isOrganizationIdTaken = async function (organizationId, excludeUserId) {
  const user = await this.findOne({ organizationId, _id: { $ne: excludeUserId } , active:true });
  return !!user;
};
/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('findOneAndUpdate', async function (next) {
  // console.log("update hook fired")
  const user = this;
  // console.log("-----------user", user);
  if (user._update && user._update.password) {
    user._update.password = await bcrypt.hash(user._update.password, 8);
  }
  next();
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  if (user.role) {
    user.seqId = await counterIncrementor('users')
  } else {
    user.seqId = await counterIncrementor(user.role)
  }

  // console.log("user schema checking password value", user.password)
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('users', userSchema);

module.exports = User;
