import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: true },
  description: { type: String, default: "" },
  genre: [{ type: String }],
  language: { type: String, default: "Hindi" },
  durationMinutes: { type: Number, default: 120 },
  posterUrl: { type: String, default: "" },
  rating: { type: Number, min: 0, max: 10, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

movieSchema.index({ title: "text", description: "text" });
export default mongoose.model("Movie", movieSchema);
