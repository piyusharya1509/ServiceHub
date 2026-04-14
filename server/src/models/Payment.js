const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    amount: Number,

    // 🔥 ESCROW STATUS
    status: {
      type: String,
      enum: ["held", "released"],
      default: "held",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paymentId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);