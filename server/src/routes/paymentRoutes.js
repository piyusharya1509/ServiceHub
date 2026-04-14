const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const { protect } = require("../middleware/auth");

// 🔥 INIT RAZORPAY
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// =====================================
// 🔥 CREATE ORDER
// =====================================
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount required",
      });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json({
      success: true,
      order,
    });

  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
});


// =====================================
// 🔥 VERIFY PAYMENT + ESCROW HOLD
// =====================================
router.post("/verify-payment", protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      vendorId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    // 💸 COMMISSION
    const commissionRate = 0.1;
    const platformFee = amount * commissionRate;
    const vendorAmount = amount - platformFee;

    // 💾 SAVE PAYMENT (🔥 ESCROW HELD)
    const payment = await Payment.create({
      user: req.user._id,
      vendor: vendorId,
      amount,
      platformFee,
      vendorAmount,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "held", // 🔥 CHANGED
      isPaid: true,
    });

    // 📦 CREATE BOOKING
    const now = new Date();

    const booking = await Booking.create({
      vendor: vendorId,
      vendorName: "Service Provider",
      description: "Service booked via payment",
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString(),
      paymentId: payment._id,
      status: "Scheduled",
    });

    res.json({
      success: true,
      payment,
      booking,
    });

  } catch (err) {
    console.error("Verify Error:", err);
    res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
});


// =====================================
// 🔥 RELEASE PAYMENT (ESCROW → VENDOR)
// =====================================
router.post("/release/:bookingId", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    const payment = await Payment.findById(booking.paymentId);

    if (!payment) {
      return res.status(404).json({ success: false });
    }

    if (payment.status === "released") {
      return res.json({ success: true, message: "Already released" });
    }

    payment.status = "released";
    await payment.save();

    res.json({
      success: true,
      message: "Payment released to vendor 💰",
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// =====================================
// 🔥 USER PAYMENTS
// =====================================
router.get("/my-payments", protect, async (req, res) => {
  try {
    const payments = await Payment.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      payments,
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// =====================================
// 🔥 VENDOR EARNINGS (ONLY RELEASED)
// =====================================
router.get("/vendor-earnings", protect, async (req, res) => {
  try {
    const payments = await Payment.find({
      vendor: req.user._id,
      status: "released", // 🔥 IMPORTANT
    });

    const total = payments.reduce((acc, p) => acc + p.vendorAmount, 0);

    res.json({
      success: true,
      total,
      payments,
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// =====================================
// 🔥 ADMIN REVENUE
// =====================================
router.get("/admin/revenue", protect, async (req, res) => {
  try {
    const payments = await Payment.find();

    const totalRevenue = payments.reduce((acc, p) => acc + p.platformFee, 0);
    const totalSales = payments.reduce((acc, p) => acc + p.amount, 0);

    res.json({
      success: true,
      totalRevenue,
      totalSales,
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// =====================================
// 🔥 ADMIN TOP VENDORS (ONLY RELEASED)
// =====================================
router.get("/admin/top-vendors", protect, async (req, res) => {
  try {
    const payments = await Payment.find({
      status: "released",
    });

    const vendorMap = {};

    payments.forEach((p) => {
      if (!vendorMap[p.vendor]) {
        vendorMap[p.vendor] = 0;
      }
      vendorMap[p.vendor] += p.vendorAmount;
    });

    const result = Object.entries(vendorMap).map(([vendor, earnings]) => ({
      vendor,
      earnings,
    }));

    res.json({
      success: true,
      vendors: result.sort((a, b) => b.earnings - a.earnings),
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;