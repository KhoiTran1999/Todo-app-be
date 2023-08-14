const mongoose = require("mongoose");

const registerTokenSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    token: {
      type: String,
      require: true,
      unique: true,
    },
  },
  { timestamps: true }
);

registerTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

module.exports = mongoose.model("registerToken", registerTokenSchema);
