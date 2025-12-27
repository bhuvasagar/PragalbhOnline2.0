import mongoose from "mongoose";

const GlobalStatsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      default: "site_stats",
    },
    visits: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("GlobalStats", GlobalStatsSchema);
