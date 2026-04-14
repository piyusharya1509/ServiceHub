const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const {
  signup,
  login,
  getMe,
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// =====================
// NORMAL AUTH
// =====================
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);

// =====================
// GOOGLE LOGIN (WITH ROLE)
// =====================
router.get(
  "/google",
  (req, res, next) => {
    const role = req.query.role || "customer";
    req.session.role = role;
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// =====================
// GOOGLE CALLBACK
// =====================
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    const role = req.session?.role || "customer";

    let user = await User.findById(req.user._id);

    // 🔥 NEW USER SETUP
    if (user.provider === "google" && user.password === "google_oauth") {
      if (!user.role || user.role === "customer") {
        user.role = role;
      }

      // profile incomplete if no phone
      if (!user.phone) {
        user.isProfileComplete = false;
      }

      await user.save();
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // =====================
    // 🔥 REDIRECT LOGIC
    // =====================
    let redirectPath = "/dashboard";

    if (!user.isProfileComplete) {
      redirectPath = "/complete-profile";
    } else if (user.role === "vendor") {
      redirectPath = "/vendor-dashboard";
    }

    res.redirect(
      `${process.env.CLIENT_ORIGIN}/oauth-success?token=${token}&redirect=${redirectPath}`
    );
  }
);

module.exports = router;