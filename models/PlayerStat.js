import mongoose from "mongoose";

const playerStatsSchema = mongoose.Schema(
  {
    run: {
      type: Number,
      default: 0,
    },
    wicket: {
      type: Number,
      default: 0,
    },
    catch: {
      type: Number,
      default: 0,
    },
    stumping: {
      type: Number,
      default: 0,
    },
    runOut: {
      type: Number,
      default: 0,
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PlayerScore", playerStatsSchema);
