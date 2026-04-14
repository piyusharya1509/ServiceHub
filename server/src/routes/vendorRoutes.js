const express = require("express");
const router = express.Router();
const Vendor = require("../models/Vendor");

console.log("🔥 DB VENDOR ROUTE ACTIVE");

// 🔥 GET VENDORS FROM DATABASE
router.get("/", async (req, res) => {
  try {
    const { maxPrice, minRating, available, search, category } = req.query;

    const query = {};

    if (maxPrice) query.price = { $lte: Number(maxPrice) };
    if (minRating) query.rating = { $gte: Number(minRating) };
    if (available === "true") query.available = true;

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    const vendors = await Vendor.find(query).sort({ rating: -1 });

    res.json({
      success: true,
      vendors,
    });

  } catch (error) {
    console.error("Vendor Fetch Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching vendors",
    });
  }
});

module.exports = router;