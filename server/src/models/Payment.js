const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },

    amount: Number,

    // 🔥 NEW FIELDS
    platformFee: Number,
    vendorAmount: Number,

    paymentId: String,
    orderId: String,

    status: {
      type: String,
      default: "paid",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);