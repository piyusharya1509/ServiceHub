const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "general",
    },
    rating: {
      type: Number,
      default: 4,
    },
    price: {
      type: Number,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);