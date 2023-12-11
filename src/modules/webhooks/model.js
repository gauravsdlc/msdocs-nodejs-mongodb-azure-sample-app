const mongoose = require("mongoose");

const WebhookSchema = mongoose.Schema(
  {
    endpoint: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    orgId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    isActive:{
      type: Boolean,
      default: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    lastError: {
      type: String,
      default: "",
    },
    failCount: {
      type: Number,
      default: 0,
    },
    successCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Counters = mongoose.model("webhooks", WebhookSchema);
module.exports = Counters;
