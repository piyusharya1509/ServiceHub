const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },

    vendorName: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    date: {
      type: String,
      default: "",
    },

    time: {
      type: String,
      default: "",
    },

    // 🔥 LINK PAYMENT
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },

    status: {
      type: String,
      enum: ["Scheduled", "accepted", "rejected", "completed"],
      default: "Scheduled",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);