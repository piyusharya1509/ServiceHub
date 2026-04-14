const express = require("express");
const { protect } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// =====================
// COMPLETE PROFILE
// =====================
router.put("/me", protect, async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findById(req.user._id);

    user.phone = phone;
    user.isProfileComplete = true;

    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// =====================
// SUBMIT KYC (VENDOR)
// =====================
router.post("/kyc", protect, async (req, res) => {
  try {
    const { aadhaar, pan, documentUrl } = req.body;

    const user = await User.findById(req.user._id);

    if (user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Only vendors can submit KYC",
      });
    }

    user.kyc = { aadhaar, pan, documentUrl };
    user.isKYCSubmitted = true;
    user.isVerified = false;

    await user.save();

    res.json({
      success: true,
      message: "KYC submitted successfully",
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;