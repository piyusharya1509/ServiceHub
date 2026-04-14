const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// =====================
// GET ALL KYC REQUESTS
// =====================
router.get("/kyc", protect, authorize("admin"), async (req, res) => {
  const vendors = await User.find({
    role: "vendor",
    isKYCSubmitted: true,
    isVerified: false,
  });

  res.json({ success: true, vendors });
});

// =====================
// APPROVE KYC
// =====================
router.put("/kyc/:id/approve", protect, authorize("admin"), async (req, res) => {
  const user = await User.findById(req.params.id);

  user.isVerified = true;

  await user.save();

  res.json({ success: true, message: "Vendor verified" });
});

module.exports = router;