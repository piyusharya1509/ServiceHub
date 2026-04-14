const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const {
  signup,
  login,
  getMe,
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");

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

    // SET ROLE IF NEW USER
    if (req.user.password === "google_oauth") {
      req.user.role = role;
      await req.user.save();
    }

    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔥 REDIRECT BASED ON ROLE
    const redirectPath =
      req.user.role === "vendor"
        ? "/vendor-dashboard"
        : "/dashboard";

    res.redirect(
      `${process.env.CLIENT_ORIGIN}/oauth-success?token=${token}&redirect=${redirectPath}`
    );
  }
);

module.exports = router;