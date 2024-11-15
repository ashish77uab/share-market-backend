import mongoose from "mongoose";

const playerStatHistorySchema = mongoose.Schema(
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
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
    },
    isCompleted:{
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

export default mongoose.model("PlayerStatHistory", playerStatHistorySchema);
