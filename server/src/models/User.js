const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      default: "customer",
    },

    phone: { type: String, default: "" },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    isProfileComplete: { type: Boolean, default: false },

    // 🔥 KYC SYSTEM
    isKYCSubmitted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },

    kyc: {
      aadhaar: String,
      pan: String,
      documentUrl: String,
    },
  },
  { timestamps: true }
);

// HASH PASSWORD
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.provider === "google") {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);