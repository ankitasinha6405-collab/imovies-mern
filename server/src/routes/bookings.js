import { Router } from "express";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();
const PRICE_PER_SEAT = 180;

router.get("/my", requireAuth, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("movie", "title posterUrl")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) { next(err); }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { movieId, showDate, showTime, seats } = req.body;
    if (!mongoose.isValidObjectId(movieId)) return res.status(400).json({ message: "Invalid movie ID." });
    if (!showDate || !showTime || !Array.isArray(seats) || seats.length < 1 || seats.length > 10) {
      return res.status(400).json({ message: "Choose a date, showtime and 1–10 seats." });
    }
    const uniqueSeats = [...new Set(seats.map(s => String(s).trim().toUpperCase()))];
    if (uniqueSeats.some(s => !/^[A-F](?:[1-9]|1[0-2])$/.test(s))) {
      return res.status(400).json({ message: "Seat labels must be between A1 and F12." });
    }
    const movie = await Movie.findOne({ _id: movieId, isActive: true });
    if (!movie) return res.status(404).json({ message: "Movie not found." });

    // Starter only: a production version must atomically lock seats per show to prevent concurrent double-booking.
    const booking = await Booking.create({
      user: req.user.id, movie: movie._id, showDate, showTime,
      seats: uniqueSeats, totalAmount: uniqueSeats.length * PRICE_PER_SEAT
    });
    res.status(201).json({ message: "Booking created.", booking });
  } catch (err) { next(err); }
});

router.patch("/:id/cancel", requireAuth, async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) return res.status(404).json({ message: "Booking not found." });
    if (booking.status === "cancelled") return res.status(400).json({ message: "Booking is already cancelled." });
    booking.status = "cancelled";
    await booking.save();
    res.json({ message: "Booking cancelled.", booking });
  } catch (err) { next(err); }
});

export default router;
