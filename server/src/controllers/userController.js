const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

// 🔥 GET CURRENT USER
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.json({
    success: true,
    user,
  });
});

// 🔥 UPDATE PROFILE
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = name || user.name;
  user.phone = phone || user.phone;

  const updated = await user.save();

  res.json({
    success: true,
    user: {
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      role: updated.role,
    },
  });
});

module.exports = { getMe, updateProfile };