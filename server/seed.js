const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Vendor = require("./src/models/Vendor");

dotenv.config();

const seedVendors = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Vendor.deleteMany();

  await Vendor.insertMany([
    {
      name: "Doremon Cleaning Service",
      category: "cleaning",
      rating: 4.8,
      price: 500,
      available: true,
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
    },
    {
      name: "Electrician Pro",
      category: "electrician",
      rating: 4.6,
      price: 1200,
      available: true,
      image:
        "https://images.unsplash.com/photo-1581092335397-9583eb92d232",
    },
    {
      name: "Painter Rangers",
      category: "painting",
      rating: 4.7,
      price: 1800,
      available: false,
      image:
        "https://images.unsplash.com/photo-1562259949-e8e7689d7828",
    },
  ]);

  console.log("✅ Vendors Seeded");
  process.exit();
};

seedVendors();