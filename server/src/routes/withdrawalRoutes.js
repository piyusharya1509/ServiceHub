const express = require("express");
const router = express.Router();

const Withdrawal = require("../models/Withdrawal");
const Payment = require("../models/Payment");
const { protect } = require("../middleware/auth");


// =====================================
// 🔥 REQUEST WITHDRAWAL (VENDOR)
// =====================================
router.post("/request", protect, async (req, res) => {
  try {
    const { amount, accountDetails } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount required",
      });
    }

    // 💰 CALCULATE TOTAL EARNINGS
    const payments = await Payment.find({
      vendor: req.user._id,
    });

    const totalEarnings = payments.reduce(
      (acc, p) => acc + p.vendorAmount,
      0
    );

    if (amount > totalEarnings) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    const withdrawal = await Withdrawal.create({
      vendor: req.user._id,
      amount,
      accountDetails,
    });

    res.json({
      success: true,
      withdrawal,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});


// =====================================
// 🔥 GET VENDOR WITHDRAWALS
// =====================================
router.get("/my-withdrawals", protect, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({
      vendor: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      withdrawals,
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// =====================================
// 🔥 ADMIN: GET ALL WITHDRAWALS
// =====================================
router.get("/admin/all", protect, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find()
      .populate("vendor", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      withdrawals,
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// =====================================
// 🔥 ADMIN: UPDATE STATUS
// =====================================
router.patch("/admin/:id", protect, async (req, res) => {
  try {
    const { status } = req.body;

    const withdrawal = await Withdrawal.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({
      success: true,
      withdrawal,
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;