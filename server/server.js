require("dotenv").config(); // ✅ MUST BE FIRST

const connectDB = require("./src/config/db");
const app = require("./src/app");

// =========================
// 🔥 HANDLE UNCAUGHT EXCEPTIONS
// =========================
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

// =========================
// 🚀 START SERVER
// =========================
const start = async () => {
  try {
    await connectDB();

    // 🔐 TRUST PROXY (REQUIRED FOR RENDER / HTTPS)
    app.set("trust proxy", 1);

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // =========================
    // 🔥 HANDLE UNHANDLED PROMISE REJECTIONS
    // =========================
    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Rejection:", err.message);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

start();