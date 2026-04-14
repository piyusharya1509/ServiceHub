const Booking = require("../models/Booking");
const asyncHandler = require("../middleware/asyncHandler");

const createBooking = asyncHandler(async (req, res) => {
  const { vendor, vendorName, description, date, time } = req.body;

  const booking = await Booking.create({
    vendor,
    vendorName,
    description,
    date,
    time,
  });

  res.status(201).json({
    success: true,
    booking,
  });
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    bookings,
  });
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  booking.status = req.body.status || booking.status;

  await booking.save();

  res.status(200).json({
    success: true,
    booking,
  });
});

module.exports = {
  createBooking,
  getMyBookings,
  updateBookingStatus,
};