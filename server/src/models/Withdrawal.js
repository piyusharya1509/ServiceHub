const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "paid"],
      default: "pending",
    },

    method: {
      type: String,
      default: "bank_transfer",
    },

    accountDetails: {
      accountNumber: String,
      ifsc: String,
      name: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Withdrawal", withdrawalSchema);